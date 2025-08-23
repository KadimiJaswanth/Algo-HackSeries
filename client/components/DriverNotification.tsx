import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FiMapPin as MapPin,
  FiNavigation as Navigation,
  FiClock as Clock,
  FiUser as User,
  FiCheckCircle as CheckCircle,
  FiX as X,
  FiPhone as Phone,
} from "react-icons/fi";
import { FaCar as Car } from "react-icons/fa";

interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedFare: number;
  distance: number;
  estimatedDuration: number;
  vehicleType: string;
  timestamp: Date;
  urgency: "normal" | "high" | "urgent";
}

interface DriverNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  rideRequest: RideRequest | null;
  onAccept: (requestId: string) => void;
  onIgnore: (requestId: string) => void;
}

export default function DriverNotification({
  isOpen,
  onClose,
  rideRequest,
  onAccept,
  onIgnore,
}: DriverNotificationProps) {
  const [countdown, setCountdown] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen || !rideRequest) return;

    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleIgnore(); // Auto-ignore after timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, rideRequest]);

  const handleAccept = async () => {
    if (!rideRequest) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAccept(rideRequest.id);
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error("Error accepting ride:", error);
      setIsProcessing(false);
    }
  };

  const handleIgnore = async () => {
    if (!rideRequest) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onIgnore(rideRequest.id);
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error("Error ignoring ride:", error);
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "border-red-500/50 bg-red-500/10";
      case "high":
        return "border-orange-500/50 bg-orange-500/10";
      default:
        return "border-primary/50 bg-primary/10";
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    return <Car className="h-5 w-5" />;
  };

  if (!rideRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              📱 New Ride Request
            </span>
            <div className="flex items-center space-x-2">
              <Badge 
                className={`animate-pulse ${
                  countdown <= 10 ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                  "bg-primary/20 text-primary border-primary/30"
                }`}
              >
                {countdown}s
              </Badge>
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">6301214658</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Ride request from {rideRequest.riderName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ride Details Card */}
          <Card className={`${getUrgencyColor(rideRequest.urgency)} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getVehicleIcon(rideRequest.vehicleType)}
                  <span className="font-semibold capitalize">{rideRequest.vehicleType}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {rideRequest.estimatedFare.toFixed(6)} TOKENS
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {rideRequest.distance.toFixed(1)} km • {rideRequest.estimatedDuration} min
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Pickup Location */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-green-500/20 mt-0.5">
                  <MapPin className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-xs text-muted-foreground">
                    {rideRequest.pickupLocation}
                  </p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-red-500/20 mt-0.5">
                  <Navigation className="h-4 w-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-xs text-muted-foreground">
                    {rideRequest.dropoffLocation}
                  </p>
                </div>
              </div>

              {/* Rider Info */}
              <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-full bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{rideRequest.riderName}</p>
                  <p className="text-xs text-muted-foreground">
                    Requested {new Date(rideRequest.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleIgnore}
              disabled={isProcessing}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              size="lg"
            >
              {isProcessing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Ignore
                </>
              )}
            </Button>
            
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isProcessing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
          </div>

          {/* Auto-timeout Warning */}
          {countdown <= 10 && (
            <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-sm text-red-400 font-medium">
                ⚠️ Auto-declining in {countdown} seconds
              </p>
            </div>
          )}

          {/* Estimated Earnings */}
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium text-primary">
              💰 Estimated Earnings: {rideRequest.estimatedFare.toFixed(6)} TOKENS
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Payment secured via smart contract
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing driver notifications
export function useDriverNotifications() {
  const [notifications, setNotifications] = useState<RideRequest[]>([]);
  const [currentNotification, setCurrentNotification] = useState<RideRequest | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const addNotification = (rideRequest: RideRequest) => {
    setNotifications(prev => [...prev, rideRequest]);
    setCurrentNotification(rideRequest);
    setShowNotification(true);
  };

  const handleAccept = (requestId: string) => {
    console.log(`Accepted ride request: ${requestId}`);
    setNotifications(prev => prev.filter(n => n.id !== requestId));
    setShowNotification(false);
    
    // Trigger success notification
    alert(`Ride accepted! ETA to pickup: 5 minutes. Rider has been notified.`);
  };

  const handleIgnore = (requestId: string) => {
    console.log(`Ignored ride request: ${requestId}`);
    setNotifications(prev => prev.filter(n => n.id !== requestId));
    setShowNotification(false);
    
    // Show next notification if any
    const remaining = notifications.filter(n => n.id !== requestId);
    if (remaining.length > 0) {
      setTimeout(() => {
        setCurrentNotification(remaining[0]);
        setShowNotification(true);
      }, 1000);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return {
    currentNotification,
    showNotification,
    addNotification,
    handleAccept,
    handleIgnore,
    closeNotification,
  };
}
