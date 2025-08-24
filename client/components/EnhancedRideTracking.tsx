import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FiPhone as Phone,
  FiMessageSquare as MessageSquare,
  FiNavigation as Navigation,
  FiClock as Clock,
  FiUser as User,
  FiMapPin as MapPin,
  FiCheckCircle as CheckCircle,
  FiX as X,
  FiAlertTriangle as AlertTriangle,
  FiLoader as Loader,
  FiMap as Map,
} from "react-icons/fi";
import { FaCar as Car } from "react-icons/fa";
import GeoapifyMaps from "./GeoapifyMaps";
import { useSmsNotification } from "@/lib/sms-service";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface RideData {
  pickup: Location;
  dropoff: Location;
  estimatedFare: number;
  riderName: string;
}

interface DriverInfo {
  name: string;
  phone: string;
  carModel: string;
  licensePlate: string;
  rating: number;
  eta: number;
  currentLocation?: Location;
}

type RideStatus =
  | "searching"
  | "pending"
  | "accepted"
  | "pickup"
  | "in_progress"
  | "completed"
  | "cancelled";

interface EnhancedRideTrackingProps {
  rideData: RideData;
  onCancel: () => void;
  onComplete: () => void;
}

export default function EnhancedRideTracking({
  rideData,
  onCancel,
  onComplete,
}: EnhancedRideTrackingProps) {
  const { sendNotification, pollStatus } = useSmsNotification();

  // Ride state management
  const [rideStatus, setRideStatus] = useState<RideStatus>("searching");
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [showAutoCancel, setShowAutoCancel] = useState(false);

  // Auto-cancel timeout
  const autoCancel = useRef<NodeJS.Timeout | null>(null);
  const statusPolling = useRef<boolean>(false);

  // Driver phone number
  const DRIVER_PHONE = "6301214658";

  useEffect(() => {
    initializeRideRequest();
    return () => {
      // Cleanup timers
      if (autoCancel.current) {
        clearTimeout(autoCancel.current);
      }
    };
  }, []);

  useEffect(() => {
    // Timer for elapsed time
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeRideRequest = async () => {
    try {
      setIsLoading(true);
      setRideStatus("searching");

      // Send SMS notification to driver
      const notificationResult = await sendNotification(
        rideData.riderName,
        rideData.pickup.address,
        rideData.dropoff.address,
        rideData.estimatedFare,
      );

      if (notificationResult.success) {
        setCurrentRideId(notificationResult.rideId);
        setRideStatus("pending");
        setIsLoading(false);

        // Start auto-cancel timer (5 minutes)
        autoCancel.current = setTimeout(
          () => {
            handleAutoCancel();
          },
          5 * 60 * 1000,
        ); // 5 minutes

        // Start polling for driver response
        startStatusPolling(notificationResult.rideId);
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error initializing ride request:", error);
      setRideStatus("cancelled");
      setIsLoading(false);
    }
  };

  const startStatusPolling = (rideId: string) => {
    if (statusPolling.current) return;

    statusPolling.current = true;

    pollStatus(rideId, (status) => {
      if (status === "accepted") {
        handleDriverAccepted();
      } else if (status === "ignored") {
        handleDriverIgnored();
      }
    })
      .catch((error) => {
        console.error("Error polling driver response:", error);
      })
      .finally(() => {
        statusPolling.current = false;
      });
  };

  const handleDriverAccepted = () => {
    // Clear auto-cancel timer
    if (autoCancel.current) {
      clearTimeout(autoCancel.current);
      autoCancel.current = null;
    }

    // Set driver info (in real app, this would come from the database)
    setDriverInfo({
      name: "Driver",
      phone: DRIVER_PHONE,
      carModel: "Available Vehicle",
      licensePlate: "RIDE-001",
      rating: 4.8,
      eta: Math.floor(Math.random() * 8) + 3,
      currentLocation: {
        lat: rideData.pickup.lat + (Math.random() - 0.5) * 0.01,
        lng: rideData.pickup.lng + (Math.random() - 0.5) * 0.01,
        address: "En route to pickup",
      },
    });

    setRideStatus("accepted");
    setIsLoading(false);

    // NOTE: Removed automatic ride progression for more realistic behavior.
    // In a real app, status would update based on driver's GPS location and manual updates.
  };

  const handleDriverIgnored = () => {
    setRideStatus("cancelled");
    setIsLoading(false);

    // Clear auto-cancel timer
    if (autoCancel.current) {
      clearTimeout(autoCancel.current);
      autoCancel.current = null;
    }
  };

  const handleAutoCancel = () => {
    setRideStatus("cancelled");
    setShowAutoCancel(true);
    setIsLoading(false);
  };

  const handleManualCancel = () => {
    if (autoCancel.current) {
      clearTimeout(autoCancel.current);
      autoCancel.current = null;
    }
    setRideStatus("cancelled");
    onCancel();
  };

  const handleCallDriver = () => {
    if (driverInfo) {
      window.open(`tel:+91${driverInfo.phone}`, "_self");
    }
  };

  const handleMessageDriver = () => {
    if (driverInfo) {
      const message = encodeURIComponent(
        `Hi, this is your rider. I'm waiting at ${rideData.pickup.address}`,
      );
      window.open(`sms:+91${driverInfo.phone}?body=${message}`, "_self");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadgeColor = () => {
    switch (rideStatus) {
      case "searching":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500 animate-pulse";
      case "accepted":
        return "bg-green-500";
      case "pickup":
        return "bg-orange-500";
      case "in_progress":
        return "bg-purple-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (rideStatus) {
      case "searching":
        return "Searching for driver...";
      case "pending":
        return "Waiting for driver response...";
      case "accepted":
        return "Driver accepted! Coming to pick you up";
      case "pickup":
        return "Driver is on the way to pickup";
      case "in_progress":
        return "Ride in progress";
      case "cancelled":
        return "Ride cancelled";
      default:
        return "Unknown status";
    }
  };

  const getProgressValue = () => {
    const elapsed = Math.min(timeElapsed, 300); // Cap at 5 minutes
    return (elapsed / 300) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Ride Status
            </CardTitle>
            <Badge className={`text-white ${getStatusBadgeColor()}`}>
              {getStatusText()}
            </Badge>
          </div>
          <CardDescription>
            Driver: +91 {DRIVER_PHONE} • Time elapsed: {formatTime(timeElapsed)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar for Pending Status */}
          {rideStatus === "pending" && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Waiting for driver response...</span>
                <span>{Math.max(0, 300 - timeElapsed)}s remaining</span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Auto-cancels after 5 minutes if no response
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">
                  Sending notification to driver...
                </p>
              </div>
            </div>
          )}

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-green-500/20 mt-0.5">
                <MapPin className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-xs text-muted-foreground">
                  {rideData.pickup.address}
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
                  {rideData.dropoff.address}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated Fare</span>
              <span className="text-lg font-bold text-primary">
                {rideData.estimatedFare.toFixed(4)} TOKENS
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Information (when accepted) */}
      {rideStatus === "accepted" && driverInfo && (
        <Card className="glass border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Driver Found!
            </CardTitle>
            <CardDescription>Your driver is on the way</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{driverInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {driverInfo.carModel} • {driverInfo.licensePlate}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(driverInfo.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {driverInfo.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {driverInfo.eta} min
                </p>
                <p className="text-sm text-muted-foreground">ETA</p>
              </div>
            </div>

            {/* Communication Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleCallDriver}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Driver
              </Button>
              <Button
                onClick={handleMessageDriver}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Map (when driver is assigned) */}
      {driverInfo && driverInfo.currentLocation && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="mr-2 h-5 w-5" />
              Live Tracking
            </CardTitle>
            <CardDescription>
              Track your driver's location in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleMaps
              pickup={rideData.pickup}
              dropoff={rideData.dropoff}
              driverLocation={driverInfo.currentLocation}
              mode="tracking"
              className="w-full h-64 rounded-lg border"
            />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {(rideStatus === "pending" || rideStatus === "searching") && (
          <Button
            onClick={handleManualCancel}
            variant="outline"
            className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Ride
          </Button>
        )}

        {rideStatus === "accepted" && (
          <Button
            onClick={() => setShowCommunicationDialog(true)}
            className="flex-1"
          >
            <Phone className="mr-2 h-4 w-4" />
            Contact Driver
          </Button>
        )}

        {rideStatus === "in_progress" && (
          <Button
            onClick={onComplete}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Ride
          </Button>
        )}
      </div>

      {/* Auto-Cancel Dialog */}
      <Dialog open={showAutoCancel} onOpenChange={setShowAutoCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Ride Auto-Cancelled
            </DialogTitle>
            <DialogDescription>
              The ride was automatically cancelled because the driver didn't
              respond within 5 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-800">
                  📱 Driver ({DRIVER_PHONE}) didn't respond to the ride request
                  in time. You can try booking another ride or contact support
                  if needed.
                </p>
              </CardContent>
            </Card>
            <Button
              onClick={() => {
                setShowAutoCancel(false);
                onCancel();
              }}
              className="w-full"
            >
              Try Booking Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication Dialog */}
      <Dialog
        open={showCommunicationDialog}
        onOpenChange={setShowCommunicationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Your Driver</DialogTitle>
            <DialogDescription>
              Communicate with your driver directly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {driverInfo && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{driverInfo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        +91 {driverInfo.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  handleCallDriver();
                  setShowCommunicationDialog(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              <Button
                onClick={() => {
                  handleMessageDriver();
                  setShowCommunicationDialog(false);
                }}
                variant="outline"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
