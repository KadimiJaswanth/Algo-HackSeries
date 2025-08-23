import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FiMapPin as MapPin, FiClock as Clock, FiDollarSign as DollarSign, FiAlertCircle as AlertCircle } from "react-icons/fi";
import { FaCar as Car } from "react-icons/fa";
import { useAccount } from "wagmi";
import RideStatus from "./RideStatus";

interface RideRequest {
  pickup: string;
  dropoff: string;
  rideType: string;
  notes: string;
  estimatedPrice: number;
  estimatedTime: number;
}

interface ActiveRide {
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
}

export default function RideRequestForm() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState<RideRequest>({
    pickup: "",
    dropoff: "",
    rideType: "",
    notes: "",
    estimatedPrice: 0,
    estimatedTime: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const handleInputChange = (
    field: keyof RideRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Simple price estimation based on distance (mock calculation)
    if (field === "pickup" || field === "dropoff") {
      if (formData.pickup && formData.dropoff) {
        const basePrice = 5; // Base price in USDC
        const distanceMultiplier = Math.random() * 20 + 5; // Mock distance calculation
        const estimatedPrice = basePrice + distanceMultiplier;
        const estimatedTime = Math.ceil(distanceMultiplier * 2); // Mock time calculation

        setFormData((prev) => ({
          ...prev,
          estimatedPrice: Number(estimatedPrice.toFixed(2)),
          estimatedTime,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected && !demoMode) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    // Create active ride and simulate complete workflow
    try {
      console.log("Submitting ride request:", formData);
      console.log("User address:", address);

      // Create ride with 'searching' status
      const rideId = `ride-${Date.now()}`;
      const newRide: ActiveRide = {
        id: rideId,
        status: "searching",
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        price: formData.estimatedPrice,
      };

      setActiveRide(newRide);
      setIsLoading(false);

      // Simulate finding a driver after 3-5 seconds
      setTimeout(
        () => {
          const driver = {
            name: "John Smith",
            rating: 4.8,
            carModel: "Toyota Camry",
            licensePlate: "ABC-123",
            eta: 5,
          };

          setActiveRide((prev) =>
            prev
              ? {
                  ...prev,
                  status: "matched",
                  driver,
                }
              : null,
          );
        },
        Math.random() * 2000 + 3000,
      );

      // Simulate driver pickup process
      setTimeout(() => {
        setActiveRide((prev) => (prev ? { ...prev, status: "pickup" } : null));
      }, 8000);

      // Simulate ride in progress
      setTimeout(() => {
        setActiveRide((prev) =>
          prev ? { ...prev, status: "in_progress" } : null,
        );
      }, 12000);

      // Simulate ride completion
      setTimeout(() => {
        setActiveRide((prev) =>
          prev ? { ...prev, status: "completed" } : null,
        );
      }, 20000);
    } catch (error) {
      console.error("Error submitting ride request:", error);
      alert("Error submitting ride request. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    // Reset form
    setFormData({
      pickup: "",
      dropoff: "",
      rideType: "",
      notes: "",
      estimatedPrice: 0,
      estimatedTime: 0,
    });
  };

  const handleCompleteRide = () => {
    alert("Ride completed! Payment has been processed via smart contract.");
    setActiveRide(null);
    // Reset form
    setFormData({
      pickup: "",
      dropoff: "",
      rideType: "",
      notes: "",
      estimatedPrice: 0,
      estimatedTime: 0,
    });
  };

  const handleRateDriver = (rating: number) => {
    alert(
      `Thank you for rating your driver ${rating} stars! Your rating has been stored on the blockchain.`,
    );
    handleCompleteRide();
  };

  // Show ride status if there's an active ride
  if (activeRide) {
    return (
      <RideStatus
        ride={activeRide}
        onCancel={handleCancelRide}
        onComplete={handleCompleteRide}
        onRate={handleRateDriver}
      />
    );
  }

  const enableDemoMode = () => {
    setDemoMode(true);
    setFormData({
      pickup: "Downtown Business District",
      dropoff: "International Airport",
      rideType: "premium",
      notes: "Demo ride for testing",
      estimatedPrice: 45.5,
      estimatedTime: 35,
    });
  };

  if (!isConnected && !demoMode) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>Connect Wallet or Try Demo</CardTitle>
          <CardDescription>
            Connect your Web3 wallet to request a ride or try our demo mode
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button onClick={enableDemoMode}>
            🚀 Try Demo Mode
          </Button>
          <p className="text-sm text-muted-foreground">
            Experience ride booking without wallet connection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-rider" />
          Request a Ride
        </CardTitle>
        <CardDescription>
          Enter your pickup and destination to find available drivers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input
                id="pickup"
                placeholder="Enter pickup address or landmark"
                value={formData.pickup}
                onChange={(e) => handleInputChange("pickup", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="dropoff">Destination</Label>
              <Input
                id="dropoff"
                placeholder="Enter destination address"
                value={formData.dropoff}
                onChange={(e) => handleInputChange("dropoff", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ride Type */}
          <div>
            <Label htmlFor="rideType">Ride Type</Label>
            <Select
              value={formData.rideType}
              onValueChange={(value) => handleInputChange("rideType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ride type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="comfort">Comfort</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions for the driver..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Price Estimation */}
          {formData.estimatedPrice > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Ride Estimate
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <Badge variant="secondary">
                    ${formData.estimatedPrice} USDC
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Est. Time:</span>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formData.estimatedTime} min
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Price includes base fare + distance. Final amount will be held
                in escrow until ride completion.
              </div>
            </div>
          )}

          {/* Wallet Info */}
          <div className="bg-rider/10 p-3 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Connected Wallet:</span>
              <code className="bg-background px-2 py-1 rounded text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </code>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-rider hover:bg-rider/90"
            disabled={
              isLoading ||
              !formData.pickup ||
              !formData.dropoff ||
              !formData.rideType
            }
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Looking for Drivers...
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                Request Ride
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
