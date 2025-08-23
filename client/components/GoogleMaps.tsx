import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapsProps {
  pickup?: Location;
  dropoff?: Location;
  driverLocation?: Location;
  onLocationSelect?: (location: Location, type: "pickup" | "dropoff") => void;
  mode?: "select" | "track" | "view";
  className?: string;
}

export default function GoogleMaps({
  pickup,
  dropoff,
  driverLocation,
  onLocationSelect,
  mode = "view",
  className = "w-full h-96",
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectingFor, setSelectingFor] = useState<"pickup" | "dropoff" | null>(
    null,
  );
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "demo-key",
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        // For demo purposes, create a mock map if no API key
        if (
          !import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY === "demo-key"
        ) {
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
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          const directionsServiceInstance = new google.maps.DirectionsService();
          const directionsRendererInstance = new google.maps.DirectionsRenderer(
            {
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#4F46E5",
                strokeWeight: 4,
              },
            },
          );

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
                  lng: position.coords.longitude,
                };
                setUserLocation(location);
                mapInstance.setCenter(location);
              },
              (error) => {
                console.warn("Geolocation error:", error);
              },
            );
          }

          // Add click listener for location selection
          if (mode === "select") {
            mapInstance.addListener(
              "click",
              (event: google.maps.MapMouseEvent) => {
                if (event.latLng && selectingFor && onLocationSelect) {
                  const location = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  };
                  onLocationSelect(location, selectingFor);
                  setSelectingFor(null);
                }
              },
            );
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        createDemoMap();
      }
    };

    initMap();
  }, [mode, selectingFor, onLocationSelect]);

  // Create demo map for when Google Maps API is not available
  const createDemoMap = () => {
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full relative overflow-hidden rounded-lg" style="background: linear-gradient(135deg, hsl(225 25% 8%) 0%, hsl(240 15% 12%) 50%, hsl(280 15% 8%) 100%);">
          <!-- Animated background effects -->
          <div class="absolute inset-0" style="background: rgba(168, 85, 247, 0.1); backdrop-filter: blur(10px);"></div>

          <!-- Grid pattern -->
          <div class="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(168, 85, 247)" stroke-width="1"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <!-- Floating orbs -->
          <div class="absolute top-1/4 left-1/4 w-16 h-16 rounded-full" style="background: radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%); animation: float 3s ease-in-out infinite;"></div>
          <div class="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full" style="background: radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%); animation: float 3s ease-in-out infinite; animation-delay: 1.5s;"></div>

          <div class="flex items-center justify-center h-full">
            <div class="text-center z-10 p-6" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 1rem;">
              <div class="mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: rgb(168, 85, 247); filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5));">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2" style="color: rgb(168, 85, 247); text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);">Futuristic Map Interface</h3>
              <p class="text-sm mb-4" style="color: rgba(255, 255, 255, 0.8);">
                Real-time location tracking with blockchain integration
              </p>
              <div class="text-xs px-3 py-1 rounded-full" style="background: rgba(168, 85, 247, 0.2); color: rgb(168, 85, 247); border: 1px solid rgba(168, 85, 247, 0.3);">
                Connect Google Maps API for live functionality
              </div>
            </div>
          </div>

          <!-- Enhanced demo markers with glow -->
          <div class="absolute top-1/4 left-1/3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background: linear-gradient(135deg, rgb(34, 197, 94), rgb(168, 85, 247)); box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); animation: pulse 2s ease-in-out infinite;">P</div>
          <div class="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background: linear-gradient(135deg, rgb(239, 68, 68), rgb(168, 85, 247)); box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); animation: pulse 2s ease-in-out infinite; animation-delay: 1s;">D</div>

          <!-- Animated route line -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(168, 85, 247);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(34, 197, 94);stop-opacity:1" />
              </linearGradient>
            </defs>
            <path d="M 33% 25% Q 50% 40% 75% 67%" stroke="url(#routeGradient)" stroke-width="3" fill="none" stroke-dasharray="10,5" style="filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.5)); animation: dash 2s linear infinite;">
              <animate attributeName="stroke-dashoffset" values="0;-15" dur="1s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
      `;
    }
  };

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];

    // Add pickup marker
    if (pickup) {
      const pickupMarker = new google.maps.Marker({
        position: pickup,
        map: map,
        title: "Pickup Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#10B981"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#10B981">P</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 40),
        },
      });
      newMarkers.push(pickupMarker);
    }

    // Add dropoff marker
    if (dropoff) {
      const dropoffMarker = new google.maps.Marker({
        position: dropoff,
        map: map,
        title: "Drop-off Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#EF4444"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#EF4444">D</text>
            </svg>
          `),
        },
      });
      newMarkers.push(dropoffMarker);
    }

    // Add driver marker
    if (driverLocation) {
      const driverMarker = new google.maps.Marker({
        position: driverLocation,
        map: map,
        title: "Driver Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25C30 6.716 23.284 0 15 0z" fill="#3B82F6"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6">🚗</text>
            </svg>
          `),
        },
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
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);
          }
        },
      );
    }

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      map.fitBounds(bounds);

      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 16) map.setZoom(16);
        google.maps.event.removeListener(listener);
      });
    }
  }, [
    map,
    pickup,
    dropoff,
    driverLocation,
    directionsService,
    directionsRenderer,
  ]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          if (map) {
            map.setCenter(location);
            map.setZoom(15);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please check your browser permissions.",
          );
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div ref={mapRef} className={cn(className, "rounded-lg")} />

      {/* Control buttons for selection mode */}
      {mode === "select" && (
        <div className="absolute top-4 left-4 space-y-2 animate-slide-in-left">
          <Button
            size="sm"
            variant={selectingFor === "pickup" ? "default" : "outline"}
            onClick={() => setSelectingFor("pickup")}
            className="glass glass-hover glow-hover border-green-500/30"
          >
            <MapPin className="mr-2 h-4 w-4 text-green-400 glow-accent" />
            Set Pickup
          </Button>
          <Button
            size="sm"
            variant={selectingFor === "dropoff" ? "default" : "outline"}
            onClick={() => setSelectingFor("dropoff")}
            className="glass glass-hover glow-hover border-red-500/30"
          >
            <MapPin className="mr-2 h-4 w-4 text-red-400 glow-accent" />
            Set Dropoff
          </Button>
        </div>
      )}

      {/* Current location button */}
      <Button
        size="sm"
        variant="outline"
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 glass glass-hover glow animate-float"
      >
        <Crosshair className="h-4 w-4 text-primary" />
      </Button>

      {/* Location indicators */}
      {mode !== "select" && (
        <div className="absolute top-4 right-4 space-y-2 animate-slide-in-right">
          {pickup && (
            <Badge className="glass bg-green-500/20 text-green-400 border-green-500/30 glow-accent">
              <MapPin className="mr-1 h-3 w-3" />
              Pickup Set
            </Badge>
          )}
          {dropoff && (
            <Badge className="glass bg-red-500/20 text-red-400 border-red-500/30 glow-accent">
              <MapPin className="mr-1 h-3 w-3" />
              Dropoff Set
            </Badge>
          )}
          {driverLocation && (
            <Badge className="glass bg-blue-500/20 text-blue-400 border-blue-500/30 glow-accent">
              <Navigation className="mr-1 h-3 w-3" />
              Driver Tracking
            </Badge>
          )}
        </div>
      )}

      {selectingFor && (
        <div className="absolute bottom-4 left-4 animate-fade-in-up">
          <Badge className="glass bg-primary/20 text-primary border-primary/30 animate-glow">
            <span className="animate-pulse">🎯</span>
            <span className="ml-2">Tap on map to set {selectingFor} location</span>
          </Badge>
        </div>
      )}
    </div>
  );
}
