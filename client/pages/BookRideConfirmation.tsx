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
  FiPhone as Phone,
  FiMessageCircle as MessageCircle,
  FiStar as Star,
  FiUser as User,
} from "react-icons/fi";
import { FaCar as Car, FaBicycle as Bike } from "react-icons/fa";
import { FiTruck as Truck } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RideDetails {
  vehicleId: string;
  vehicleName: string;
  fare: number;
  estimatedTime: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

interface DriverInfo {
  name: string;
  rating: number;
  avatar?: string;
  vehicle: {
    model: string;
    licensePlate: string;
  };
  phone: string;
}

export default function BookRideConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [showDriverInfo, setShowDriverInfo] = useState(false);

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

      // NOTE: Removed automatic fake driver assignment.
      // This page should not be used in the production flow.
      // Use Enhanced Ride Tracking component instead for real SMS-based driver assignment.
    }

    // NOTE: Removed auto-redirect timer.
    // This page should not automatically redirect.
    // Users should use the Enhanced Ride Tracking flow instead.
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

  const getRandomDriverName = () => {
    const names = [
      "Alex Johnson",
      "Sarah Chen",
      "Mike Rodriguez",
      "Emily Davis",
      "David Kim",
      "Lisa Anderson",
      "Carlos Martinez",
      "Anna Wilson",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomCarModel = (vehicleId: string) => {
    const models = {
      bike: ["Honda CB", "Yamaha R15", "Bajaj Pulsar"],
      auto: ["Bajaj Auto", "TVS King", "Mahindra Alfa"],
      car: ["Toyota Camry", "Honda Civic", "Hyundai Elantra"],
      premium: ["BMW 5 Series", "Audi A4", "Mercedes C-Class"],
    };
    const categoryModels =
      models[vehicleId as keyof typeof models] || models.car;
    return categoryModels[Math.floor(Math.random() * categoryModels.length)];
  };

  const generateLicensePlate = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}-${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}-${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
  };

  const generatePhoneNumber = () => {
    return "6301214658";
  };

  const handleCall = () => {
    if (driverInfo) {
      alert(`Driver Number: 6301214658`);
    }
  };

  const handleChat = () => {
    if (driverInfo) {
      // Navigate to chat page with driver details
      const params = new URLSearchParams({
        driverName: driverInfo.name,
        driverRating: driverInfo.rating.toString(),
        vehicle: driverInfo.vehicle.model,
        licensePlate: driverInfo.vehicle.licensePlate,
      });
      navigate(`/driver-chat?${params.toString()}`);
    }
  };

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Loading ride confirmation...
            </p>
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
            <div className="mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {rideDetails.fare.toFixed(6)} TOKENS
              </Badge>
            </div>
            <CardDescription className="mt-2">
              Ride booking confirmed
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

        {/* Driver Assignment Status */}
        {!showDriverInfo ? (
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-500/20 animate-pulse">
                  <Users className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400">
                    Finding Driver
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We're connecting you with the nearest driver...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500/30 bg-green-500/10 animate-fade-in-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-400 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Driver Assigned
                </h4>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ETA: {rideDetails?.estimatedTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Driver Profile */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-green-500/30">
                  <AvatarImage
                    src={driverInfo?.avatar}
                    alt={driverInfo?.name}
                  />
                  <AvatarFallback className="bg-green-500/20 text-green-400">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h5 className="font-semibold">{driverInfo?.name}</h5>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {driverInfo?.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {driverInfo?.vehicle.model}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    License: {driverInfo?.vehicle.licensePlate}
                  </p>
                </div>
              </div>

              {/* Communication Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="flex items-center space-x-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Driver</span>
                </Button>
                <Button
                  onClick={handleChat}
                  variant="outline"
                  className="flex items-center space-x-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </Button>
              </div>

              {/* Driver Status */}
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  🚗 Driver is on the way to your location
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive updates as your driver approaches
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deprecated Page Notice */}
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-yellow-600 font-medium">
              ⚠️ This page is for demo purposes only
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Real ride booking uses SMS-based driver assignment.
              Please use the main booking flow for actual rides.
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="space-y-3">
          {showDriverInfo && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button
                onClick={handleCall}
                variant="outline"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                size="lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Quick Call
              </Button>
              <Button
                onClick={handleChat}
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
          )}

          <Button
            onClick={() => navigate("/rider?tab=track")}
            className="w-full bg-primary hover:bg-primary/90 glow"
            size="lg"
          >
            <Navigation className="mr-2 h-5 w-5" />
            Go to Ride Tracking
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full glass-hover"
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
