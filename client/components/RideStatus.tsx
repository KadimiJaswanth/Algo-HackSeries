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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  Phone,
  MessageCircle,
  Car,
  Navigation,
} from "lucide-react";

interface RideStatusProps {
  ride: {
    id: string;
    status: "searching" | "matched" | "pickup" | "in_progress" | "completed";
    pickup: string;
    dropoff: string;
    price: number;
    driver?: {
      name: string;
      rating: number;
      carModel: string;
      licensePlate: string;
      eta: number;
    };
  };
  onCancel?: () => void;
  onComplete?: () => void;
  onRate?: (rating: number) => void;
}

export default function RideStatus({
  ride,
  onCancel,
  onComplete,
  onRate,
}: RideStatusProps) {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);

      // Simulate progress based on ride status
      if (ride.status === "searching") {
        setProgress((prev) => Math.min(prev + 2, 25));
      } else if (ride.status === "matched") {
        setProgress(35);
      } else if (ride.status === "pickup") {
        setProgress(50);
      } else if (ride.status === "in_progress") {
        setProgress((prev) => Math.min(prev + 1, 90));
      } else if (ride.status === "completed") {
        setProgress(100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ride.status]);

  const getStatusInfo = () => {
    switch (ride.status) {
      case "searching":
        return {
          title: "Searching for Driver",
          description: "Looking for nearby drivers...",
          color: "bg-yellow-500",
        };
      case "matched":
        return {
          title: "Driver Found!",
          description: "Your driver is on the way to pick you up",
          color: "bg-blue-500",
        };
      case "pickup":
        return {
          title: "Driver Arriving",
          description: "Your driver is arriving at pickup location",
          color: "bg-orange-500",
        };
      case "in_progress":
        return {
          title: "On the Way",
          description: "Heading to your destination",
          color: "bg-green-500",
        };
      case "completed":
        return {
          title: "Ride Completed",
          description: "You have arrived at your destination",
          color: "bg-green-600",
        };
      default:
        return {
          title: "Unknown Status",
          description: "",
          color: "bg-gray-500",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Ride #{ride.id.slice(-6)}</CardTitle>
            <CardDescription>
              <Badge className={`${statusInfo.color} text-white`}>
                {statusInfo.title}
              </Badge>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{statusInfo.description}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Route Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">{ride.pickup}</span>
          </div>
          <div className="flex items-center space-x-3 ml-1">
            <div className="h-6 w-0.5 bg-muted-foreground/30" />
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">{ride.dropoff}</span>
          </div>
        </div>

        <Separator />

        {/* Driver Information */}
        {ride.driver && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <User className="mr-2 h-4 w-4" />
              Driver Details
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{ride.driver.name}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">⭐ {ride.driver.rating}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {ride.driver.carModel} • {ride.driver.licensePlate}
              </div>
              {ride.status === "matched" && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>ETA: {ride.driver.eta} minutes</span>
                </div>
              )}
            </div>

            {/* Driver Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Fare</span>
            <span className="font-medium">${ride.price} USDC</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {ride.status === "completed"
              ? "Payment processed via smart contract"
              : "Held in escrow until completion"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {ride.status === "searching" && onCancel && (
            <Button variant="destructive" onClick={onCancel} className="w-full">
              Cancel Ride
            </Button>
          )}

          {ride.status === "completed" && onRate && (
            <div className="space-y-2">
              <Button onClick={onComplete} className="w-full">
                Confirm Arrival
              </Button>
              <div className="text-center">
                <span className="text-sm text-muted-foreground mr-2">
                  Rate your driver:
                </span>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onRate(rating)}
                    className="text-lg hover:text-yellow-500 transition-colors"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}

          {ride.status === "in_progress" && (
            <Button variant="outline" className="w-full">
              <Navigation className="mr-2 h-4 w-4" />
              Track Location
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
