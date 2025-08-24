import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FiMapPin as MapPin,
  FiNavigation as Navigation,
  FiCrosshair as Crosshair,
} from "react-icons/fi";
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
        // Debug environment variables
        console.log("Environment check:", {
          VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          allEnvVars: import.meta.env
        });

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "demo-key";
        console.log("Using API key:", apiKey);

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        // Always use Google Maps with the provided API key

        await loader.load();

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco default
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            // Remove custom styling to get exact Google Maps UI
            styles: [],
          });

          const directionsServiceInstance = new google.maps.DirectionsService();
          const directionsRendererInstance = new google.maps.DirectionsRenderer(
            {
              suppressMarkers: true, // We'll use our own markers
              polylineOptions: {
                strokeColor: "#4285F4", // Google Maps blue
                strokeWeight: 5,
                strokeOpacity: 0.8,
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
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-red-50 rounded-lg border-2 border-red-200">
              <div class="text-center p-6">
                <div class="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 class="text-lg font-semibold text-red-700 mb-2">Google Maps failed to load</h3>
                <p class="text-sm text-red-600">Please check your API key and internet connection</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();
  }, [mode, selectingFor, onLocationSelect]);

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];

    // Add pickup marker with standard Google Maps styling
    if (pickup) {
      const pickupMarker = new google.maps.Marker({
        position: pickup,
        map: map,
        title: "Pickup Location",
        label: {
          text: "A",
          color: "white",
          fontWeight: "bold",
        },
        // Use default Google Maps marker color for pickup (green)
      });
      newMarkers.push(pickupMarker);
    }

    // Add dropoff marker with standard Google Maps styling
    if (dropoff) {
      const dropoffMarker = new google.maps.Marker({
        position: dropoff,
        map: map,
        title: "Drop-off Location",
        label: {
          text: "B",
          color: "white",
          fontWeight: "bold",
        },
        // Use default Google Maps marker (red) for dropoff
      });
      newMarkers.push(dropoffMarker);
    }

    // Add driver marker with car icon
    if (driverLocation) {
      const driverMarker = new google.maps.Marker({
        position: driverLocation,
        map: map,
        title: "Driver Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 8,
        },
        label: {
          text: "🚗",
          fontSize: "12px",
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

  // Always render Google Maps container

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div ref={mapRef} className={cn(className, "rounded-lg")} />

      {/* Control buttons for selection mode */}
      {mode === "select" && (
        <div className="absolute top-4 left-4 space-y-2">
          <Button
            size="sm"
            variant={selectingFor === "pickup" ? "default" : "outline"}
            onClick={() => setSelectingFor("pickup")}
            className="bg-white shadow-md hover:shadow-lg"
          >
            <MapPin className="mr-2 h-4 w-4 text-green-600" />
            Set Pickup
          </Button>
          <Button
            size="sm"
            variant={selectingFor === "dropoff" ? "default" : "outline"}
            onClick={() => setSelectingFor("dropoff")}
            className="bg-white shadow-md hover:shadow-lg"
          >
            <MapPin className="mr-2 h-4 w-4 text-red-600" />
            Set Dropoff
          </Button>
        </div>
      )}

      {/* Current location button */}
      <Button
        size="sm"
        variant="outline"
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-white shadow-md hover:shadow-lg w-10 h-10 p-0"
      >
        <Crosshair className="h-4 w-4 text-gray-600" />
      </Button>

      {/* Location indicators */}
      {mode !== "select" && (
        <div className="absolute top-4 right-4 space-y-2">
          {pickup && (
            <Badge className="bg-white shadow-md text-green-700 border border-green-200">
              <MapPin className="mr-1 h-3 w-3" />
              Pickup Set
            </Badge>
          )}
          {dropoff && (
            <Badge className="bg-white shadow-md text-red-700 border border-red-200">
              <MapPin className="mr-1 h-3 w-3" />
              Dropoff Set
            </Badge>
          )}
          {driverLocation && (
            <Badge className="bg-white shadow-md text-blue-700 border border-blue-200">
              <Navigation className="mr-1 h-3 w-3" />
              Driver Tracking
            </Badge>
          )}
        </div>
      )}

      {selectingFor && (
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-white shadow-md text-gray-700 border border-gray-200">
            <span className="mr-2">🎯</span>
            <span>Tap on map to set {selectingFor} location</span>
          </Badge>
        </div>
      )}
    </div>
  );
}
