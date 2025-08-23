import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, Car, AlertCircle } from "lucide-react";
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
  status: 'searching' | 'matched' | 'pickup' | 'in_progress' | 'completed';
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

  const handleInputChange = (field: keyof RideRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Simple price estimation based on distance (mock calculation)
    if (field === 'pickup' || field === 'dropoff') {
      if (formData.pickup && formData.dropoff) {
        const basePrice = 5; // Base price in USDC
        const distanceMultiplier = Math.random() * 20 + 5; // Mock distance calculation
        const estimatedPrice = basePrice + distanceMultiplier;
        const estimatedTime = Math.ceil(distanceMultiplier * 2); // Mock time calculation
        
        setFormData(prev => ({
          ...prev,
          estimatedPrice: Number(estimatedPrice.toFixed(2)),
          estimatedTime
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    
    // Mock ride request submission
    try {
      // This would be replaced with actual smart contract interaction
      console.log("Submitting ride request:", formData);
      console.log("User address:", address);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Ride request submitted successfully! Looking for available drivers...");
      
      // Reset form
      setFormData({
        pickup: "",
        dropoff: "",
        rideType: "",
        notes: "",
        estimatedPrice: 0,
        estimatedTime: 0,
      });
    } catch (error) {
      console.error("Error submitting ride request:", error);
      alert("Error submitting ride request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>Wallet Required</CardTitle>
          <CardDescription>
            Please connect your Web3 wallet to request a ride
          </CardDescription>
        </CardHeader>
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
                onChange={(e) => handleInputChange('pickup', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dropoff">Destination</Label>
              <Input
                id="dropoff"
                placeholder="Enter destination address"
                value={formData.dropoff}
                onChange={(e) => handleInputChange('dropoff', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ride Type */}
          <div>
            <Label htmlFor="rideType">Ride Type</Label>
            <Select value={formData.rideType} onValueChange={(value) => handleInputChange('rideType', value)}>
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
              onChange={(e) => handleInputChange('notes', e.target.value)}
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
                Price includes base fare + distance. Final amount will be held in escrow until ride completion.
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
            disabled={isLoading || !formData.pickup || !formData.dropoff || !formData.rideType}
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
