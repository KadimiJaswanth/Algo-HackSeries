import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapsProps {
  pickup?: Location;
  dropoff?: Location;
  driverLocation?: Location;
  onLocationSelect?: (location: Location, type: 'pickup' | 'dropoff') => void;
  mode?: 'select' | 'track' | 'view';
  className?: string;
}

export default function GoogleMaps({ 
  pickup, 
  dropoff, 
  driverLocation,
  onLocationSelect,
  mode = 'view',
  className = 'w-full h-96'
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectingFor, setSelectingFor] = useState<'pickup' | 'dropoff' | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key',
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        // For demo purposes, create a mock map if no API key
        if (!process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY === 'demo-key') {
          createDemoMap();
          return;
        }

        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco default
            zoom: 13,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          const directionsServiceInstance = new google.maps.DirectionsService();
          const directionsRendererInstance = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#4F46E5',
              strokeWeight: 4
            }
          });

          directionsRendererInstance.setMap(mapInstance);
          
          setMap(mapInstance);
          setDirectionsService(directionsServiceInstance);
          setDirectionsRenderer(directionsRendererInstance);

          // Get user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                setUserLocation(location);
                mapInstance.setCenter(location);
              },
              (error) => {
                console.warn('Geolocation error:', error);
              }
            );
          }

          // Add click listener for location selection
          if (mode === 'select') {
            mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
              if (event.latLng && selectingFor && onLocationSelect) {
                const location = {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng()
                };
                onLocationSelect(location, selectingFor);
                setSelectingFor(null);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        createDemoMap();
      }
    };

    initMap();
  }, [mode, selectingFor, onLocationSelect]);

  // Create demo map for when Google Maps API is not available
  const createDemoMap = () => {
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div class="text-center z-10">
            <div class="mb-4">
              <svg class="w-16 h-16 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Interactive Map Demo</h3>
            <p class="text-sm text-gray-500 max-w-xs">
              Live Google Maps integration with real-time location tracking
            </p>
            <div class="mt-4 text-xs text-gray-400">
              Connect Google Maps API for full functionality
            </div>
          </div>
          
          <!-- Demo markers -->
          <div class="absolute top-1/4 left-1/3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">P</div>
          <div class="absolute bottom-1/3 right-1/4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">D</div>
          
          <!-- Demo route line -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 33% 25% Q 50% 40% 75% 67%" stroke="#4F46E5" stroke-width="3" fill="none" stroke-dasharray="5,5" />
          </svg>
        </div>
      `;
    }
  };

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];

    // Add pickup marker
    if (pickup) {
      const pickupMarker = new google.maps.Marker({
        position: pickup,
        map: map,
        title: 'Pickup Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#10B981"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#10B981">P</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 40)
        }
      });
      newMarkers.push(pickupMarker);
    }

    // Add dropoff marker
    if (dropoff) {
      const dropoffMarker = new google.maps.Marker({
        position: dropoff,
        map: map,
        title: 'Drop-off Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#EF4444"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#EF4444">D</text>
            </svg>
          `)
        }
      });
      newMarkers.push(dropoffMarker);
    }

    // Add driver marker
    if (driverLocation) {
      const driverMarker = new google.maps.Marker({
        position: driverLocation,
        map: map,
        title: 'Driver Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#3B82F6"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6">🚗</text>
            </svg>
          `)
        }
      });
      newMarkers.push(driverMarker);
    }

    setMarkers(newMarkers);

    // Calculate and display route if both pickup and dropoff are available
    if (pickup && dropoff && directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 16) map.setZoom(16);
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, pickup, dropoff, driverLocation, directionsService, directionsRenderer]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (map) {
            map.setCenter(location);
            map.setZoom(15);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      
      {/* Control buttons for selection mode */}
      {mode === 'select' && (
        <div className="absolute top-4 left-4 space-y-2">
          <Button
            size="sm"
            variant={selectingFor === 'pickup' ? 'default' : 'outline'}
            onClick={() => setSelectingFor('pickup')}
            className="bg-white/90 backdrop-blur"
          >
            <MapPin className="mr-2 h-4 w-4 text-green-500" />
            Set Pickup
          </Button>
          <Button
            size="sm"
            variant={selectingFor === 'dropoff' ? 'default' : 'outline'}
            onClick={() => setSelectingFor('dropoff')}
            className="bg-white/90 backdrop-blur"
          >
            <MapPin className="mr-2 h-4 w-4 text-red-500" />
            Set Dropoff
          </Button>
        </div>
      )}

      {/* Current location button */}
      <Button
        size="sm"
        variant="outline"
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur"
      >
        <Crosshair className="h-4 w-4" />
      </Button>

      {/* Location indicators */}
      {mode !== 'select' && (
        <div className="absolute top-4 right-4 space-y-2">
          {pickup && (
            <Badge className="bg-green-500 text-white">
              <MapPin className="mr-1 h-3 w-3" />
              Pickup Set
            </Badge>
          )}
          {dropoff && (
            <Badge className="bg-red-500 text-white">
              <MapPin className="mr-1 h-3 w-3" />
              Dropoff Set
            </Badge>
          )}
          {driverLocation && (
            <Badge className="bg-blue-500 text-white">
              <Navigation className="mr-1 h-3 w-3" />
              Driver Tracking
            </Badge>
          )}
        </div>
      )}

      {selectingFor && (
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-primary text-white animate-pulse">
            Tap on map to set {selectingFor} location
          </Badge>
        </div>
      )}
    </div>
  );
}
