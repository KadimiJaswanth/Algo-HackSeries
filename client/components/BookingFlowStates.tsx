import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FiPhone as Phone,
  FiNavigation as Navigation,
  FiMapPin as MapPin,
  FiCheckCircle as CheckCircle,
  FiX as X,
  FiLoader as Loader,
  FiUser as User,
} from "react-icons/fi";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface SearchingData {
  pickup: Location;
  dropoff: Location;
  estimatedFare: number;
  vehicleName: string;
}

interface DriverData {
  name: string;
  phone: string;
  carModel: string;
  licensePlate: string;
  rating: number;
  eta: number;
}

interface BookingFlowStatesProps {
  flowState: "idle" | "searching" | "driver_found" | "tracking";
  searchingData: SearchingData | null;
  driverData: DriverData | null;
  onCancel: () => void;
  onStartTracking: () => void;
}

export default function BookingFlowStates({
  flowState,
  searchingData,
  driverData,
  onCancel,
  onStartTracking,
}: BookingFlowStatesProps) {
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    if (flowState === "searching") {
      const timer = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setSearchTime(0);
    }
  }, [flowState]);

  if (flowState === "idle") {
    return null;
  }

  if (flowState === "searching" && searchingData) {
    return (
      <Card className="glass border-yellow-500/20 bg-yellow-500/5 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-600">
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
            Searching for Drivers...
          </CardTitle>
          <CardDescription>
            We're finding the best driver for your {searchingData.vehicleName}{" "}
            ride
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-green-500/20 mt-0.5">
                <MapPin className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-xs text-muted-foreground">
                  {searchingData.pickup.address}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-red-500/20 mt-0.5">
                <Navigation className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-xs text-muted-foreground">
                  {searchingData.dropoff.address}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated Fare</span>
              <span className="text-lg font-bold text-primary">
                {searchingData.estimatedFare.toFixed(4)} TOKENS
              </span>
            </div>
          </div>

          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader className="h-4 w-4 animate-spin" />
              <span>
                Looking for nearby drivers... ({Math.floor(searchTime / 60)}:
                {(searchTime % 60).toString().padStart(2, "0")})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This usually takes 30-60 seconds
            </p>
          </div>

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (flowState === "driver_found" && driverData && searchingData) {
    return (
      <Card className="glass border-green-500/20 bg-green-500/5 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            Driver Found!
          </CardTitle>
          <CardDescription>
            Your driver has accepted the ride and is coming to pick you up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <User className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">{driverData.name}</p>
                <p className="text-sm text-muted-foreground">
                  {driverData.carModel} • {driverData.licensePlate}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(driverData.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {driverData.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {driverData.eta} min
              </p>
              <p className="text-sm text-muted-foreground">ETA</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-green-500/20 mt-0.5">
                <MapPin className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-xs text-muted-foreground">
                  {searchingData.pickup.address}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-red-500/20 mt-0.5">
                <Navigation className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-xs text-muted-foreground">
                  {searchingData.dropoff.address}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              🎉 Great! Your driver is on the way. You can call them or start
              tracking the ride.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  if (driverData) {
                    window.open(`tel:+91${driverData.phone}`, "_self");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Driver
              </Button>
              <Button
                onClick={onStartTracking}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
