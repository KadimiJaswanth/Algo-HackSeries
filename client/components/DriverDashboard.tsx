import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FiMapPin as MapPin,
  FiClock as Clock,
  FiDollarSign as DollarSign,
  FiUser as User,
  FiNavigation as Navigation,
  FiCheckCircle as CheckCircle,
  FiAlertCircle as AlertCircle,
  FiTruck as Truck,
  FiZap as Zap,
  FiStar as Star,
} from "react-icons/fi";
import { FaCar as Car, FaBicycle as Bike } from "react-icons/fa";
import { useAccount } from "wagmi";

interface RideRequest {
  id: string;
  riderId: string;
  pickup: string;
  dropoff: string;
  rideType: string;
  estimatedPrice: number;
  estimatedTime: number;
  distance: string;
  notes?: string;
  timestamp: string;
  surge?: number;
  passengerRating?: number;
  tip?: number;
  vehicleType: "bike" | "auto" | "car" | "premium";
}

// Mock data for available rides with enhanced details
const mockRides: RideRequest[] = [
  {
    id: "ride-001",
    riderId: "0x1234...5678",
    pickup: "Downtown Business District",
    dropoff: "International Airport",
    rideType: "Premium",
    estimatedPrice: 45.5,
    estimatedTime: 35,
    distance: "12.3 km",
    notes: "Need to catch a flight, please be on time. Have 2 large suitcases.",
    timestamp: "2 minutes ago",
    surge: 1.5,
    passengerRating: 4.9,
    tip: 5.0,
    vehicleType: "premium",
  },
  {
    id: "ride-002",
    riderId: "0x8765...4321",
    pickup: "Central Mall",
    dropoff: "University Campus",
    rideType: "RideBike",
    estimatedPrice: 8.75,
    estimatedTime: 12,
    distance: "3.2 km",
    timestamp: "3 minutes ago",
    surge: 1.2,
    passengerRating: 4.7,
    tip: 2.0,
    vehicleType: "bike",
  },
  {
    id: "ride-003",
    riderId: "0x9999...1111",
    pickup: "Train Station",
    dropoff: "Hotel District",
    rideType: "RideAuto",
    estimatedPrice: 15.25,
    estimatedTime: 18,
    distance: "5.1 km",
    notes: "Please call when you arrive",
    timestamp: "5 minutes ago",
    surge: 1.0,
    passengerRating: 4.8,
    tip: 1.5,
    vehicleType: "auto",
  },
  {
    id: "ride-004",
    riderId: "0x5555...2222",
    pickup: "Shopping Center",
    dropoff: "Residential Area",
    rideType: "RideGo",
    estimatedPrice: 22.5,
    estimatedTime: 25,
    distance: "8.7 km",
    notes: "Elderly passenger, please drive carefully",
    timestamp: "7 minutes ago",
    surge: 1.8,
    passengerRating: 5.0,
    tip: 3.0,
    vehicleType: "car",
  },
  {
    id: "ride-005",
    riderId: "0x7777...3333",
    pickup: "Medical Center",
    dropoff: "Pharmacy",
    rideType: "RideComfort",
    estimatedPrice: 12.0,
    estimatedTime: 15,
    distance: "4.5 km",
    timestamp: "9 minutes ago",
    surge: 1.0,
    passengerRating: 4.6,
    tip: 2.5,
    vehicleType: "car",
  },
];

export default function DriverDashboard() {
  const { address, isConnected } = useAccount();
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] =
    useState<RideRequest[]>(mockRides);
  const [acceptingRide, setAcceptingRide] = useState<string | null>(null);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [rideStatus, setRideStatus] = useState<
    "pickup" | "in_progress" | "completed" | null
  >(null);
  const [demoMode, setDemoMode] = useState(false);

  const handleAcceptRide = async (rideId: string) => {
    if (!isConnected && !demoMode) {
      alert("Please connect your wallet first");
      return;
    }

    setAcceptingRide(rideId);

    try {
      console.log("Accepting ride:", rideId);
      console.log("Driver address:", address);

      // Find the accepted ride
      const acceptedRide = availableRides.find((ride) => ride.id === rideId);
      if (!acceptedRide) return;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set as active ride and start pickup process
      setActiveRide(acceptedRide);
      setRideStatus("pickup");

      // Remove from available rides
      setAvailableRides((prev) => prev.filter((ride) => ride.id !== rideId));

      alert("Ride accepted! Navigate to pickup location.");

      // Simulate pickup completion after 8 seconds
      setTimeout(() => {
        setRideStatus("in_progress");
        alert("Rider picked up! Navigate to destination.");
      }, 8000);
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Error accepting ride. Please try again.");
    } finally {
      setAcceptingRide(null);
    }
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      setRideStatus("completed");
      alert(
        `Ride completed! You earned $${activeRide.estimatedPrice} USDC. Payment has been transferred to your wallet.`,
      );

      // Reset after completion
      setTimeout(() => {
        setActiveRide(null);
        setRideStatus(null);
      }, 3000);
    }
  };

  const getRideTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "premium":
        return "bg-yellow-500 text-white";
      case "comfort":
        return "bg-blue-500 text-white";
      case "economy":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const enableDemoMode = () => {
    setDemoMode(true);
    setIsOnline(true);
  };

  if (!isConnected && !demoMode) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>Connect Wallet or Try Demo</CardTitle>
          <CardDescription>
            Connect your Web3 wallet to start driving or try our demo mode
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button onClick={enableDemoMode}>
            🚀 Try Demo Mode
          </Button>
          <p className="text-sm text-muted-foreground">
            Experience driver features without wallet connection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Ride Status */}
      {activeRide && (
        <Card className="border-driver">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Navigation className="mr-2 h-5 w-5 text-driver" />
                Active Ride
              </span>
              <Badge
                className={
                  rideStatus === "pickup"
                    ? "bg-orange-500"
                    : rideStatus === "in_progress"
                      ? "bg-green-500"
                      : "bg-blue-500"
                }
              >
                {rideStatus === "pickup"
                  ? "Going to Pickup"
                  : rideStatus === "in_progress"
                    ? "Ride in Progress"
                    : "Completed"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Route */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-driver" />
                <span className="font-medium">{activeRide.pickup}</span>
              </div>
              <div className="flex items-center space-x-3 ml-1">
                <div className="h-6 w-0.5 bg-muted-foreground/30" />
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{activeRide.dropoff}</span>
              </div>
            </div>

            {/* Ride Details */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{activeRide.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${activeRide.estimatedPrice} USDC</span>
              </div>
            </div>

            {/* Action Button */}
            {rideStatus === "in_progress" && (
              <Button
                onClick={handleCompleteRide}
                className="w-full bg-driver hover:bg-driver/90"
              >
                Complete Ride
              </Button>
            )}

            {rideStatus === "pickup" && (
              <Button disabled className="w-full">
                Navigating to Pickup...
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Driver Status Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Car className="mr-2 h-5 w-5 text-driver" />
              Driver Status
            </span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="online-status" className="text-sm">
                {isOnline ? "Online" : "Offline"}
              </Label>
              <Switch
                id="online-status"
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
          </CardTitle>
          <CardDescription>
            {isOnline
              ? "You're online and visible to riders"
              : "Go online to start receiving ride requests"}
          </CardDescription>
        </CardHeader>
        {isOnline && (
          <CardContent>
            <div className="bg-driver/10 p-3 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Connected Wallet:</span>
                <code className="bg-background px-2 py-1 rounded text-xs">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Available Rides */}
      {isOnline && !activeRide ? (
        <Card>
          <CardHeader>
            <CardTitle>Available Rides</CardTitle>
            <CardDescription>
              {availableRides.length} ride
              {availableRides.length !== 1 ? "s" : ""} waiting for drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableRides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Navigation className="mx-auto h-12 w-12 mb-4" />
                <p>No rides available at the moment</p>
                <p className="text-sm">Stay online to receive new requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
                  >
                    {/* Ride Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getRideTypeColor(ride.rideType)}>
                            {ride.rideType}
                          </Badge>
                          {ride.surge && ride.surge > 1.2 && (
                            <Badge
                              variant="destructive"
                              className="animate-pulse"
                            >
                              <Zap className="mr-1 h-3 w-3" />
                              {ride.surge}x
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {ride.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ride.riderId}</span>
                          </div>
                          {ride.passengerRating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{ride.passengerRating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-driver">
                          ${ride.estimatedPrice}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          USDC
                        </div>
                        {ride.tip && ride.tip > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            +${ride.tip} tip
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Type Indicator */}
                    <div className="flex items-center space-x-2">
                      {ride.vehicleType === "bike" && (
                        <Bike className="h-4 w-4 text-green-500" />
                      )}
                      {ride.vehicleType === "auto" && (
                        <Truck className="h-4 w-4 text-yellow-500" />
                      )}
                      {ride.vehicleType === "car" && (
                        <Car className="h-4 w-4 text-blue-500" />
                      )}
                      {ride.vehicleType === "premium" && (
                        <Car className="h-4 w-4 text-purple-500" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {ride.vehicleType} Required
                      </span>
                    </div>

                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-driver" />
                        <span className="font-medium">{ride.pickup}</span>
                      </div>
                      <div className="flex items-center space-x-3 ml-1">
                        <div className="h-6 w-0.5 bg-muted-foreground/30" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{ride.dropoff}</span>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>
                          $
                          {(
                            (ride.estimatedPrice / ride.estimatedTime) *
                            60
                          ).toFixed(0)}
                          /hr
                        </span>
                      </div>
                    </div>

                    {/* Earnings Breakdown */}
                    {ride.surge && ride.surge > 1 && (
                      <div className="text-sm bg-red-50 border border-red-200 p-2 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-red-700 font-medium">
                            Surge Pricing Active
                          </span>
                          <span className="text-red-700 font-bold">
                            +$
                            {(
                              ride.estimatedPrice * ride.surge -
                              ride.estimatedPrice
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-red-600 text-xs mt-1">
                          High demand in this area • Total: $
                          {(ride.estimatedPrice * ride.surge).toFixed(2)}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {ride.notes && (
                      <>
                        <Separator />
                        <div className="text-sm">
                          <span className="font-medium">Passenger Notes: </span>
                          <span className="text-muted-foreground">
                            {ride.notes}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAcceptRide(ride.id)}
                        disabled={acceptingRide === ride.id}
                        className="flex-1 bg-driver hover:bg-driver/90"
                      >
                        {acceptingRide === ride.id ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept ${ride.estimatedPrice}
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="px-4">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : !activeRide ? (
        <Card>
          <CardContent className="text-center py-8">
            <Navigation className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Go online to see available rides
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
