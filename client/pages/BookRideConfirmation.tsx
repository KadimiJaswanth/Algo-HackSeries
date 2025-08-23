import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiCheckCircle as CheckCircle,
  FiHome as Home,
  FiMapPin as MapPin,
  FiClock as Clock,
  FiUsers as Users,
  FiNavigation as Navigation,
} from "react-icons/fi";
import { FaCar as Car, FaBicycle as Bike } from "react-icons/fa";
import { FiTruck as Truck } from "react-icons/fi";

interface RideDetails {
  vehicleId: string;
  vehicleName: string;
  fare: number;
  estimatedTime: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export default function BookRideConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get ride details from URL params
    const vehicleId = searchParams.get("vehicleId");
    const vehicleName = searchParams.get("vehicleName");
    const fare = searchParams.get("fare");
    const estimatedTime = searchParams.get("estimatedTime");
    const pickupLocation = searchParams.get("pickup");
    const dropoffLocation = searchParams.get("dropoff");

    if (vehicleId && vehicleName && fare) {
      setRideDetails({
        vehicleId,
        vehicleName,
        fare: parseFloat(fare),
        estimatedTime: estimatedTime || "5-10 min",
        pickupLocation: pickupLocation || "Current Location",
        dropoffLocation: dropoffLocation || "Selected Destination",
      });
    }

    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/rider?tab=tracking");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, navigate]);

  const getVehicleIcon = (vehicleId: string) => {
    switch (vehicleId) {
      case "bike":
        return <Bike className="h-8 w-8" />;
      case "auto":
      case "xl":
        return <Truck className="h-8 w-8" />;
      default:
        return <Car className="h-8 w-8" />;
    }
  };

  const getVehicleColor = (vehicleId: string) => {
    switch (vehicleId) {
      case "bike":
        return "bg-green-500";
      case "auto":
        return "bg-yellow-500";
      case "xl":
        return "bg-orange-500";
      case "premium":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Loading ride confirmation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Success Animation */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            Ride Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your {rideDetails.vehicleName} has been booked successfully
          </p>
        </div>

        {/* Ride Details Card */}
        <Card className="glass glow border-green-500/30">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div
                className={`p-4 rounded-lg text-white ${getVehicleColor(rideDetails.vehicleId)}`}
              >
                {getVehicleIcon(rideDetails.vehicleId)}
              </div>
            </div>
            <CardTitle className="text-xl">{rideDetails.vehicleName}</CardTitle>
            <CardDescription>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {rideDetails.fare.toFixed(6)} TOKENS
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Trip Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-xs text-muted-foreground">
                    {rideDetails.pickupLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Navigation className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-xs text-muted-foreground">
                    {rideDetails.dropoffLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium">Estimated Arrival</p>
                  <p className="text-xs text-muted-foreground">
                    {rideDetails.estimatedTime}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-400">Finding Driver</h4>
                <p className="text-sm text-muted-foreground">
                  We're connecting you with the nearest driver...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-redirect Notice */}
        <Card className="border-primary/30 bg-primary/10">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Automatically redirecting to tracking in{" "}
              <span className="font-bold text-primary">{countdown}</span> seconds
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/rider?tab=track")}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Navigation className="mr-2 h-5 w-5" />
            Track My Ride
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
        </div>

        {/* Trip ID */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Trip ID: RID-{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}
