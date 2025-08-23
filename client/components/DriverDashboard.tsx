import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, DollarSign, User, Navigation, CheckCircle, AlertCircle, Car } from "lucide-react";
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
}

// Mock data for available rides
const mockRides: RideRequest[] = [
  {
    id: "ride-001",
    riderId: "0x1234...5678",
    pickup: "Downtown Business District",
    dropoff: "International Airport",
    rideType: "Premium",
    estimatedPrice: 45.50,
    estimatedTime: 35,
    distance: "12.3 km",
    notes: "Need to catch a flight, please be on time",
    timestamp: "2 minutes ago"
  },
  {
    id: "ride-002",
    riderId: "0x8765...4321",
    pickup: "Central Mall",
    dropoff: "University Campus",
    rideType: "Economy",
    estimatedPrice: 18.25,
    estimatedTime: 20,
    distance: "6.7 km",
    timestamp: "5 minutes ago"
  },
  {
    id: "ride-003",
    riderId: "0x9999...1111",
    pickup: "Train Station",
    dropoff: "Hotel District",
    rideType: "Comfort",
    estimatedPrice: 28.75,
    estimatedTime: 25,
    distance: "8.9 km",
    notes: "Have 2 large suitcases",
    timestamp: "8 minutes ago"
  }
];

export default function DriverDashboard() {
  const { address, isConnected } = useAccount();
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] = useState<RideRequest[]>(mockRides);
  const [acceptingRide, setAcceptingRide] = useState<string | null>(null);

  const handleAcceptRide = async (rideId: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setAcceptingRide(rideId);
    
    try {
      // This would be replaced with actual smart contract interaction
      console.log("Accepting ride:", rideId);
      console.log("Driver address:", address);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove the accepted ride from available rides
      setAvailableRides(prev => prev.filter(ride => ride.id !== rideId));
      
      alert("Ride accepted successfully! Rider has been notified.");
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Error accepting ride. Please try again.");
    } finally {
      setAcceptingRide(null);
    }
  };

  const getRideTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'premium': return 'bg-yellow-500 text-white';
      case 'comfort': return 'bg-blue-500 text-white';
      case 'economy': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>Wallet Required</CardTitle>
          <CardDescription>
            Please connect your Web3 wallet to start driving
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
                {isOnline ? 'Online' : 'Offline'}
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
              : "Go online to start receiving ride requests"
            }
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
      {isOnline ? (
        <Card>
          <CardHeader>
            <CardTitle>Available Rides</CardTitle>
            <CardDescription>
              {availableRides.length} ride{availableRides.length !== 1 ? 's' : ''} waiting for drivers
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
                  <div key={ride.id} className="border rounded-lg p-4 space-y-4">
                    {/* Ride Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getRideTypeColor(ride.rideType)}>
                            {ride.rideType}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{ride.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{ride.riderId}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-driver">
                          ${ride.estimatedPrice}
                        </div>
                        <div className="text-sm text-muted-foreground">USDC</div>
                      </div>
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.distance}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {ride.notes && (
                      <>
                        <Separator />
                        <div className="text-sm">
                          <span className="font-medium">Notes: </span>
                          <span className="text-muted-foreground">{ride.notes}</span>
                        </div>
                      </>
                    )}

                    {/* Accept Button */}
                    <Button
                      onClick={() => handleAcceptRide(ride.id)}
                      disabled={acceptingRide === ride.id}
                      className="w-full bg-driver hover:bg-driver/90"
                    >
                      {acceptingRide === ride.id ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Accepting Ride...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept Ride
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Navigation className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Go online to see available rides</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
