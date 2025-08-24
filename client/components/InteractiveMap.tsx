import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  FiMapPin as MapPin, 
  FiNavigation as Navigation, 
  FiCrosshair as Crosshair,
  FiZoomIn as ZoomIn,
  FiZoomOut as ZoomOut,
  FiLayers as Layers,
  FiRotateCcw as RotateCcw,
  FiSearch as Search
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface MapMarker {
  id: string;
  position: Location;
  type: "pickup" | "dropoff" | "driver" | "user";
  label?: string;
  color?: string;
}

interface InteractiveMapProps {
  pickup?: Location;
  dropoff?: Location;
  driverLocation?: Location;
  onLocationSelect?: (location: Location, type: "pickup" | "dropoff") => void;
  mode?: "select" | "track" | "view";
  className?: string;
}

// Mock location data for realistic demo
const mockLocations = [
  { lat: 37.7749, lng: -122.4194, address: "Downtown San Francisco" },
  { lat: 37.7849, lng: -122.4094, address: "Chinatown, San Francisco" },
  { lat: 37.7649, lng: -122.4294, address: "Mission District" },
  { lat: 37.7949, lng: -122.3994, address: "Financial District" },
  { lat: 37.7549, lng: -122.4394, address: "Castro District" },
];

const mapStyles = [
  { id: "standard", name: "Standard", icon: "🗺️" },
  { id: "satellite", name: "Satellite", icon: "🛰️" },
  { id: "hybrid", name: "Hybrid", icon: "🌍" },
  { id: "terrain", name: "Terrain", icon: "🏔️" },
];

export default function InteractiveMap({
  pickup,
  dropoff,
  driverLocation,
  onLocationSelect,
  mode = "view",
  className = "w-full h-96",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [selectingFor, setSelectingFor] = useState<"pickup" | "dropoff" | null>(null);
  const [mapStyle, setMapStyle] = useState("standard");
  const [searchQuery, setSearchQuery] = useState("");
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  // Convert lat/lng to pixel coordinates
  const latLngToPixel = useCallback((lat: number, lng: number) => {
    const mapBounds = mapRef.current?.getBoundingClientRect();
    if (!mapBounds) return { x: 0, y: 0 };
    
    // Simple mercator projection approximation
    const x = ((lng + 180) / 360) * mapBounds.width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (mapBounds.height / 2) - (mercN * mapBounds.height) / (2 * Math.PI);
    
    return { x, y };
  }, []);

  // Convert pixel coordinates to lat/lng
  const pixelToLatLng = useCallback((x: number, y: number) => {
    const mapBounds = mapRef.current?.getBoundingClientRect();
    if (!mapBounds) return { lat: 0, lng: 0 };
    
    const lng = (x / mapBounds.width) * 360 - 180;
    const mercN = ((mapBounds.height / 2 - y) * 2 * Math.PI) / mapBounds.height;
    const lat = (Math.atan(Math.exp(mercN)) - Math.PI / 4) * 2 * 180 / Math.PI;
    
    return { lat, lng };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    const newMarkers: MapMarker[] = [];

    if (pickup) {
      newMarkers.push({
        id: "pickup",
        position: pickup,
        type: "pickup",
        label: "P",
        color: "#10B981"
      });
    }

    if (dropoff) {
      newMarkers.push({
        id: "dropoff",
        position: dropoff,
        type: "dropoff",
        label: "D",
        color: "#EF4444"
      });
    }

    if (driverLocation) {
      newMarkers.push({
        id: "driver",
        position: driverLocation,
        type: "driver",
        label: "🚗",
        color: "#3B82F6"
      });
    }

    setMarkers(newMarkers);
  }, [pickup, dropoff, driverLocation]);

  // Handle map click
  const handleMapClick = (event: React.MouseEvent) => {
    if (!selectingFor || !onLocationSelect) return;

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { lat, lng } = pixelToLatLng(x, y);

    // Add some randomness to make it feel more realistic
    const adjustedLat = lat + (Math.random() - 0.5) * 0.001;
    const adjustedLng = lng + (Math.random() - 0.5) * 0.001;

    const location = {
      lat: adjustedLat,
      lng: adjustedLng,
      address: `Location (${adjustedLat.toFixed(4)}, ${adjustedLng.toFixed(4)})`
    };

    onLocationSelect(location, selectingFor);
    setSelectingFor(null);
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Mock search - in real app this would use geocoding API
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    setCenter(randomLocation);
    setSearchQuery("");
  };

  // Handle zoom
  const handleZoom = (direction: "in" | "out") => {
    setZoom(prev => {
      const newZoom = direction === "in" ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(20, newZoom));
    });
  };

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(location);
          setZoom(15);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Fallback to San Francisco
          setCenter({ lat: 37.7749, lng: -122.4194 });
        }
      );
    }
  };

  // Generate route path between pickup and dropoff
  const generateRoutePath = () => {
    if (!pickup || !dropoff) return "";
    
    const start = latLngToPixel(pickup.lat, pickup.lng);
    const end = latLngToPixel(dropoff.lat, dropoff.lng);
    
    // Create curved path with control points
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 50; // Curve upward
    
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={cn(className, "relative cursor-crosshair overflow-hidden")}
        onClick={handleMapClick}
        style={{
          backgroundImage: mapStyle === "satellite" 
            ? `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23166534'/%3E%3Cpath d='M20 20h60v60H20z' fill='%23065f46'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23059669'/%3E%3Ccircle cx='70' cy='70' r='3' fill='%23047857'/%3E%3C/svg%3E")`
            : mapStyle === "terrain"
            ? `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M0 80 Q25 60 50 80 T100 80 V100 H0 Z' fill='%23d1d5db'/%3E%3Cpath d='M0 90 Q25 70 50 90 T100 90 V100 H0 Z' fill='%23e5e7eb'/%3E%3C/svg%3E")`
            : `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)`,
          backgroundSize: '100px 100px',
          transform: `scale(${1 + (zoom - 13) * 0.1})`,
          transformOrigin: 'center'
        }}
      >
        {/* Grid overlay for realistic map look */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
          </svg>
        </div>

        {/* Streets and roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="road" width="20" height="4" patternUnits="userSpaceOnUse">
              <rect width="20" height="4" fill="#64748b"/>
              <rect x="0" y="1.5" width="8" height="1" fill="#f1f5f9"/>
              <rect x="12" y="1.5" width="8" height="1" fill="#f1f5f9"/>
            </pattern>
          </defs>
          
          {/* Main roads */}
          <rect x="0" y="45%" width="100%" height="8" fill="url(#road)" opacity="0.7"/>
          <rect x="45%" y="0" width="8" height="100%" fill="url(#road)" opacity="0.7"/>
          <rect x="0" y="25%" width="100%" height="6" fill="url(#road)" opacity="0.5"/>
          <rect x="25%" y="0" width="6" height="100%" fill="url(#road)" opacity="0.5"/>
          <rect x="0" y="75%" width="100%" height="6" fill="url(#road)" opacity="0.5"/>
          <rect x="75%" y="0" width="6" height="100%" fill="url(#road)" opacity="0.5"/>
        </svg>

        {/* Landmarks and buildings */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[30%] w-8 h-8 bg-blue-200 rounded-sm opacity-60 shadow-sm"></div>
          <div className="absolute top-[40%] left-[60%] w-12 h-6 bg-green-200 rounded-sm opacity-60 shadow-sm"></div>
          <div className="absolute top-[70%] left-[20%] w-6 h-10 bg-orange-200 rounded-sm opacity-60 shadow-sm"></div>
          <div className="absolute top-[60%] left-[80%] w-10 h-8 bg-purple-200 rounded-sm opacity-60 shadow-sm"></div>
          <div className="absolute top-[30%] left-[75%] w-4 h-4 bg-red-200 rounded-full opacity-60 shadow-sm"></div>
        </div>

        {/* Route path */}
        {pickup && dropoff && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path 
              d={generateRoutePath()} 
              stroke="url(#routeGradient)" 
              strokeWidth="4" 
              fill="none" 
              strokeDasharray="8,4"
              className="animate-pulse"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            />
          </svg>
        )}

        {/* Markers */}
        {markers.map((marker) => {
          const { x, y } = latLngToPixel(marker.position.lat, marker.position.lng);
          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-full animate-bounce"
              style={{ left: x, top: y }}
            >
              <div 
                className="w-8 h-10 rounded-full rounded-b-none flex items-center justify-center text-white text-sm font-bold shadow-lg"
                style={{ 
                  backgroundColor: marker.color,
                  clipPath: 'polygon(50% 100%, 0% 75%, 0% 0%, 100% 0%, 100% 75%)'
                }}
              >
                {marker.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-16 animate-slide-in-down">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Search for places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="glass pr-10"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSearch}
              className="absolute right-1 top-1 h-6 w-6 p-0"
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Control buttons for selection mode */}
      {mode === "select" && (
        <div className="absolute top-16 left-4 space-y-2 animate-slide-in-left">
          <Button
            size="sm"
            variant={selectingFor === "pickup" ? "default" : "outline"}
            onClick={() => setSelectingFor("pickup")}
            className="glass glass-hover w-full justify-start"
          >
            <MapPin className="mr-2 h-4 w-4 text-green-400" />
            Set Pickup
          </Button>
          <Button
            size="sm"
            variant={selectingFor === "dropoff" ? "default" : "outline"}
            onClick={() => setSelectingFor("dropoff")}
            className="glass glass-hover w-full justify-start"
          >
            <MapPin className="mr-2 h-4 w-4 text-red-400" />
            Set Dropoff
          </Button>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2 animate-slide-in-right">
        <div className="flex flex-col space-y-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom("in")}
            className="glass glass-hover w-10 h-10 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom("out")}
            className="glass glass-hover w-10 h-10 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowStyleSelector(!showStyleSelector)}
            className="glass glass-hover w-10 h-10 p-0"
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={getCurrentLocation}
            className="glass glass-hover w-10 h-10 p-0"
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map style selector */}
      {showStyleSelector && (
        <Card className="absolute top-16 right-4 w-48 glass animate-fade-in-down">
          <CardContent className="p-3">
            <div className="space-y-2">
              {mapStyles.map((style) => (
                <Button
                  key={style.id}
                  size="sm"
                  variant={mapStyle === style.id ? "default" : "outline"}
                  onClick={() => {
                    setMapStyle(style.id);
                    setShowStyleSelector(false);
                  }}
                  className="w-full justify-start glass-hover"
                >
                  <span className="mr-2">{style.icon}</span>
                  {style.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location indicators */}
      <div className="absolute bottom-4 left-4 space-y-2 animate-slide-in-up">
        {pickup && (
          <Badge className="glass bg-green-500/20 text-green-400 border-green-500/30">
            <MapPin className="mr-1 h-3 w-3" />
            Pickup: {pickup.address || 'Selected'}
          </Badge>
        )}
        {dropoff && (
          <Badge className="glass bg-red-500/20 text-red-400 border-red-500/30">
            <MapPin className="mr-1 h-3 w-3" />
            Dropoff: {dropoff.address || 'Selected'}
          </Badge>
        )}
        {driverLocation && (
          <Badge className="glass bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Navigation className="mr-1 h-3 w-3" />
            Driver Nearby
          </Badge>
        )}
      </div>

      {/* Selection prompt */}
      {selectingFor && (
        <div className="absolute bottom-4 right-4 animate-fade-in-up">
          <Badge className="glass bg-primary/20 text-primary border-primary/30 animate-pulse">
            <span className="mr-2">🎯</span>
            Tap map to set {selectingFor} location
          </Badge>
        </div>
      )}

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 right-4">
        <Badge className="glass bg-muted/20 text-muted-foreground text-xs">
          Zoom: {zoom}
        </Badge>
      </div>
    </div>
  );
}
