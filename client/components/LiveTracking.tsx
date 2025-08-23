import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import GoogleMaps from "@/components/GoogleMaps";
import {
  Navigation,
  Clock,
  MapPin,
  Car,
  Route,
  Phone,
  MessageCircle,
  Share,
  Bell,
  Zap,
  CheckCircle,
} from "lucide-react";

interface RideStatus {
  stage:
    | "searching"
    | "driver_assigned"
    | "driver_en_route"
    | "driver_arrived"
    | "in_transit"
    | "completed";
  estimatedArrival: string;
  actualArrival?: string;
  progress: number;
}

interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  eta: string;
  distance: string;
}

interface LiveTrackingProps {
  rideId: string;
  isActive?: boolean;
}

export default function LiveTracking({
  rideId,
  isActive = true,
}: LiveTrackingProps) {
  const [rideStatus, setRideStatus] = useState<RideStatus>({
    stage: "driver_en_route",
    estimatedArrival: "3 mins",
    progress: 65,
  });

  const [driver] = useState<Driver>({
    id: "driver-123",
    name: "Alex Rodriguez",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    vehicle: {
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      color: "White",
      licensePlate: "ECO-789",
    },
    location: {
      lat: 37.7749,
      lng: -122.4194,
    },
    eta: "3 mins",
    distance: "0.8 km",
  });

  const [shareLocation, setShareLocation] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setRideStatus((prev) => {
        const newProgress = Math.min(prev.progress + Math.random() * 5, 100);
        let newStage = prev.stage;

        if (newProgress >= 100 && prev.stage === "driver_en_route") {
          newStage = "driver_arrived";
        } else if (newProgress >= 100 && prev.stage === "driver_arrived") {
          newStage = "in_transit";
        }

        return {
          ...prev,
          progress: newProgress,
          stage: newStage,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getStatusInfo = (stage: RideStatus["stage"]) => {
    switch (stage) {
      case "searching":
        return {
          title: "Finding your driver...",
          description: "We're matching you with the best driver nearby",
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        };
      case "driver_assigned":
        return {
          title: "Driver assigned!",
          description: `${driver.name} is preparing to pick you up`,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      case "driver_en_route":
        return {
          title: "Driver is on the way",
          description: `${driver.name} is heading to your location`,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        };
      case "driver_arrived":
        return {
          title: "Driver has arrived!",
          description: "Your driver is waiting at the pickup location",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      case "in_transit":
        return {
          title: "Ride in progress",
          description: "Enjoy your ride to the destination",
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        };
      case "completed":
        return {
          title: "Ride completed",
          description: "You have arrived at your destination",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      default:
        return {
          title: "Unknown status",
          description: "",
          color: "text-muted-foreground",
          bgColor: "bg-muted/20",
        };
    }
  };

  const statusInfo = getStatusInfo(rideStatus.stage);

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className={`absolute inset-0 ${statusInfo.bgColor}`}></div>
        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${statusInfo.bgColor}`}>
                <Navigation className={`h-5 w-5 ${statusInfo.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">
                  {statusInfo.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <Badge
              className={`${statusInfo.bgColor} ${statusInfo.color} border-current/30`}
            >
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(rideStatus.progress)}%
            </span>
          </div>
          <Progress value={rideStatus.progress} className="h-2 mb-3" />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>ETA: {rideStatus.estimatedArrival}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span>{driver.distance} away</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Your Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="border-2 border-primary/30">
                <AvatarImage src={driver.avatar} />
                <AvatarFallback>
                  {driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{driver.name}</h4>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <span className="flex items-center">⭐ {driver.rating}</span>
                  <span>•</span>
                  <span>
                    {driver.vehicle.color} {driver.vehicle.make}{" "}
                    {driver.vehicle.model}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="glass-hover">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="glass-hover">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="glass p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {driver.vehicle.year} {driver.vehicle.make}{" "}
                  {driver.vehicle.model}
                </span>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {driver.vehicle.licensePlate}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Map */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Route className="mr-2 h-5 w-5" />
              Live Location
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GoogleMaps
            pickup={{ lat: 37.7849, lng: -122.4194, address: "Your Location" }}
            dropoff={{ lat: 37.7649, lng: -122.4094, address: "Destination" }}
            driverLocation={driver.location}
            mode="track"
            className="w-full h-64 rounded-b-lg"
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="glass-hover"
              onClick={() => setShareLocation(!shareLocation)}
            >
              <Share className="mr-2 h-4 w-4" />
              {shareLocation ? "Stop Sharing" : "Share Location"}
            </Button>
            <Button
              variant="outline"
              className="glass-hover"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell className="mr-2 h-4 w-4" />
              {notifications ? "Mute Alerts" : "Enable Alerts"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trip Updates */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Trip Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Driver assigned</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-blue-500/20">
                <Car className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Driver en route</p>
                <p className="text-xs text-muted-foreground">1 minute ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-primary/20">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Live tracking active</p>
                <p className="text-xs text-muted-foreground">Now</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
