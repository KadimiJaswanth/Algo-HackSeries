import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FiMapPin as MapPin,
  FiNavigation as Navigation,
  FiCrosshair as Crosshair,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface GeoapifyMapsProps {
  pickup?: Location;
  dropoff?: Location;
  driverLocation?: Location;
  onLocationSelect?: (location: Location, type: "pickup" | "dropoff") => void;
  mode?: "select" | "track" | "view";
  className?: string;
}

export default function GeoapifyMaps({
  pickup,
  dropoff,
  driverLocation,
  onLocationSelect,
  mode = "view",
  className = "w-full h-96",
}: GeoapifyMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectingFor, setSelectingFor] = useState<"pickup" | "dropoff" | null>(
    null,
  );
  const [markers, setMarkers] = useState<any[]>([]);
  const [routeLayer, setRouteLayer] = useState<any>(null);

  const API_KEY = "9b9e7b2848814e95a77d475c086aad2c";

  // Initialize Geoapify Maps with Leaflet
  useEffect(() => {
    const initMap = async () => {
      try {
        // Don't initialize if map already exists
        if (map) return;

        // Dynamically import Leaflet to avoid SSR issues
        const leaflet = await import("leaflet");
        setL(leaflet.default);

        if (mapRef.current && leaflet.default) {
          // Check if the container already has a map instance
          if ((mapRef.current as any)._leaflet_id) {
            return;
          }

          // Fix for default markers in Leaflet
          delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
          leaflet.default.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          });

          // Create map instance
          const mapInstance = leaflet.default.map(mapRef.current, {
            center: [37.7749, -122.4194], // San Francisco default
            zoom: 13,
            zoomControl: true,
          });

          // Add Geoapify tile layer
          leaflet.default.tileLayer(
            `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${API_KEY}`,
            {
              attribution: '© <a href="https://www.geoapify.com/">Geoapify</a> | © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 18,
            }
          ).addTo(mapInstance);

          setMap(mapInstance);

          // Get user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setUserLocation(location);
                mapInstance.setView([location.lat, location.lng], 15);
              },
              (error) => {
                console.warn("Geolocation error:", error);
              },
            );
          }
        }
      } catch (error) {
        console.error("Error loading Geoapify Maps:", error);
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-red-50 rounded-lg border-2 border-red-200">
              <div class="text-center p-6">
                <div class="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 class="text-lg font-semibold text-red-700 mb-2">Geoapify Maps failed to load</h3>
                <p class="text-sm text-red-600">Please check your API key and internet connection</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []); // Remove problematic dependencies

  // Separate effect for handling mode and click listeners
  useEffect(() => {
    if (!map) return;

    // Remove any existing click listeners
    map.off("click");

    // Add click listener for location selection
    if (mode === "select") {
      map.on("click", (e: any) => {
        if (selectingFor && onLocationSelect) {
          const location = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          };
          onLocationSelect(location, selectingFor);
          setSelectingFor(null);
        }
      });
    }
  }, [map, mode, selectingFor, onLocationSelect]);

  // Update markers and route when locations change
  useEffect(() => {
    if (!map || !L) return;

    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker));
    setMarkers([]);

    // Clear existing route
    if (routeLayer) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }

    const newMarkers: any[] = [];

    // Create custom icons
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            transform: rotate(-45deg);
          ">
            <span style="transform: rotate(45deg);">${label}</span>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
    };

    // Add pickup marker
    if (pickup) {
      const pickupMarker = L.marker([pickup.lat, pickup.lng], {
        icon: createCustomIcon("#10B981", "A"),
        title: "Pickup Location",
      }).addTo(map);
      newMarkers.push(pickupMarker);
    }

    // Add dropoff marker
    if (dropoff) {
      const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], {
        icon: createCustomIcon("#EF4444", "B"),
        title: "Drop-off Location",
      }).addTo(map);
      newMarkers.push(dropoffMarker);
    }

    // Add driver marker
    if (driverLocation) {
      const driverIcon = L.divIcon({
        html: `
          <div style="
            background-color: #3B82F6;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">
            🚗
          </div>
        `,
        className: "driver-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const driverMarker = L.marker([driverLocation.lat, driverLocation.lng], {
        icon: driverIcon,
        title: "Driver Location",
      }).addTo(map);
      newMarkers.push(driverMarker);
    }

    setMarkers(newMarkers);

    // Calculate and display route if both pickup and dropoff are available
    if (pickup && dropoff) {
      fetchRoute(pickup, dropoff);
    }

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const group = L.featureGroup(newMarkers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, L, pickup, dropoff, driverLocation]);

  // Fetch route from server-side Geoapify proxy
  const fetchRoute = async (start: Location, end: Location) => {
    try {
      console.log("Fetching route from server proxy...");

      const response = await fetch(
        `/api/routing?start_lat=${start.lat}&start_lng=${start.lng}&end_lat=${end.lat}&end_lng=${end.lng}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Routing API failed:", response.status, errorText);
        // Fall back to showing a straight line between points
        drawStraightLine(start, end);
        return;
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);

        const routePolyline = L.polyline(coordinates, {
          color: "#3B82F6",
          weight: 5,
          opacity: 0.8,
        }).addTo(map);

        setRouteLayer(routePolyline);
        console.log("Route successfully displayed");
      } else {
        console.warn("No route found in response, falling back to straight line");
        drawStraightLine(start, end);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // Fall back to showing a straight line between points
      drawStraightLine(start, end);
    }
  };

  // Fallback function to draw a straight line when routing fails
  const drawStraightLine = (start: Location, end: Location) => {
    try {
      if (!L || !map) return;

      console.log("Drawing straight line fallback");
      const straightLine = L.polyline(
        [[start.lat, start.lng], [end.lat, end.lng]],
        {
          color: "#94A3B8", // Gray color to indicate it's not a real route
          weight: 3,
          opacity: 0.6,
          dashArray: "10, 10", // Dashed line to show it's estimated
        }
      ).addTo(map);

      setRouteLayer(straightLine);
    } catch (error) {
      console.error("Error drawing straight line:", error);
    }
  };

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
            map.setView([location.lat, location.lng], 15);
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
