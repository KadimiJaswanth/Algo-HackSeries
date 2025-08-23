import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Shield,
  Leaf,
  Route,
  UserPlus,
  Timer,
} from "lucide-react";

interface PoolRide {
  id: string;
  driver: {
    name: string;
    rating: number;
    avatar?: string;
    vehicleType: string;
    licensePlate: string;
  };
  route: {
    from: string;
    to: string;
    distance: string;
    duration: string;
  };
  departure: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  savings: number;
  passengers: Array<{
    name: string;
    avatar?: string;
    rating: number;
    pickupPoint: string;
  }>;
  verified: boolean;
  carbonSavings: string;
}

interface PoolRideProps {
  mode: "find" | "offer";
}

export default function PoolRides({ mode }: PoolRideProps) {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  const poolRides: PoolRide[] = [
    {
      id: "pool-1",
      driver: {
        name: "Alex Chen",
        rating: 4.9,
        avatar: "/api/placeholder/40/40",
        vehicleType: "Tesla Model 3",
        licensePlate: "ECO-123",
      },
      route: {
        from: "Downtown SF",
        to: "Silicon Valley",
        distance: "45 km",
        duration: "55 min",
      },
      departure: "8:30 AM",
      availableSeats: 2,
      totalSeats: 3,
      pricePerSeat: 25,
      savings: 40,
      passengers: [
        {
          name: "Sarah Kim",
          rating: 4.8,
          pickupPoint: "Market St",
        },
      ],
      verified: true,
      carbonSavings: "2.1 kg CO₂",
    },
    {
      id: "pool-2",
      driver: {
        name: "Michael Rodriguez",
        rating: 4.7,
        vehicleType: "Honda Accord",
        licensePlate: "GRN-456",
      },
      route: {
        from: "Mission District",
        to: "Oakland",
        distance: "25 km",
        duration: "35 min",
      },
      departure: "6:45 PM",
      availableSeats: 1,
      totalSeats: 3,
      pricePerSeat: 18,
      savings: 25,
      passengers: [
        {
          name: "Emma Wilson",
          rating: 4.9,
          pickupPoint: "16th St",
        },
        {
          name: "David Park",
          rating: 4.6,
          pickupPoint: "24th St",
        },
      ],
      verified: true,
      carbonSavings: "1.5 kg CO₂",
    },
  ];

  const offerRideData = {
    estimatedEarnings: 75,
    potentialPassengers: 12,
    routeOptimization: "85%",
    carbonImpact: "4.2 kg CO₂ saved",
  };

  return (
    <div className="space-y-6">
      {mode === "find" ? (
        <>
          {/* Pool Rides Header */}
          <Card className="glass glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-gradient">
                <Users className="mr-2 h-6 w-6" />
                Pool Rides Available
              </CardTitle>
              <p className="text-muted-foreground">
                Share rides, save money, and reduce your carbon footprint
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center glass p-3 rounded-lg">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-400" />
                  <p className="text-sm font-medium">Save up to 60%</p>
                </div>
                <div className="text-center glass p-3 rounded-lg">
                  <Leaf className="h-5 w-5 mx-auto mb-1 text-green-400" />
                  <p className="text-sm font-medium">Eco-Friendly</p>
                </div>
                <div className="text-center glass p-3 rounded-lg">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                  <p className="text-sm font-medium">Verified Riders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Pool Rides */}
          <div className="space-y-4">
            {poolRides.map((ride) => (
              <Card
                key={ride.id}
                className={`glass glass-hover cursor-pointer transition-all duration-300 ${
                  selectedRide === ride.id ? "border-primary/50 glow" : ""
                }`}
                onClick={() =>
                  setSelectedRide(selectedRide === ride.id ? null : ride.id)
                }
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Driver Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="border-2 border-primary/30">
                          <AvatarImage src={ride.driver.avatar} />
                          <AvatarFallback>
                            {ride.driver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{ride.driver.name}</h4>
                            {ride.verified && (
                              <Shield className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{ride.driver.rating}</span>
                            <span>•</span>
                            <span>{ride.driver.vehicleType}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        ${ride.savings} saved
                      </Badge>
                    </div>

                    {/* Route Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span className="text-sm">{ride.route.from}</span>
                        </div>
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <span className="text-sm">{ride.route.to}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>
                          {ride.route.distance} • {ride.route.duration}
                        </p>
                      </div>
                    </div>

                    {/* Time and Pricing */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {ride.departure}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {ride.availableSeats}/{ride.totalSeats} seats
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ${ride.pricePerSeat}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per seat
                        </p>
                      </div>
                    </div>

                    {/* Passengers */}
                    {ride.passengers.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Fellow Travelers:
                        </p>
                        <div className="flex items-center space-x-2">
                          {ride.passengers.map((passenger, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 glass px-2 py-1 rounded-md"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={passenger.avatar} />
                                <AvatarFallback className="text-xs">
                                  {passenger.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{passenger.name}</span>
                              <div className="flex items-center">
                                <Star className="h-2 w-2 text-yellow-400 fill-current" />
                                <span className="text-xs ml-1">
                                  {passenger.rating}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Environmental Impact */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          Carbon saved: {ride.carbonSavings}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="glow"
                        disabled={ride.availableSeats === 0}
                      >
                        {ride.availableSeats === 0 ? "Full" : "Join Pool"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Offer Pool Ride */
        <div className="space-y-6">
          <Card className="glass glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-gradient">
                <UserPlus className="mr-2 h-6 w-6" />
                Offer a Pool Ride
              </CardTitle>
              <p className="text-muted-foreground">
                Share your ride, earn extra income, and help the environment
              </p>
            </CardHeader>
          </Card>

          {/* Earnings Overview */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-gradient">
                Potential Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center glass p-4 rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold text-green-400">
                    ${offerRideData.estimatedEarnings}
                  </p>
                  <p className="text-sm text-muted-foreground">Est. earnings</p>
                </div>
                <div className="text-center glass p-4 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold text-blue-400">
                    {offerRideData.potentialPassengers}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interested riders
                  </p>
                </div>
                <div className="text-center glass p-4 rounded-lg">
                  <Route className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold text-purple-400">
                    {offerRideData.routeOptimization}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Route efficiency
                  </p>
                </div>
                <div className="text-center glass p-4 rounded-lg">
                  <Leaf className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <p className="text-xl font-bold text-green-400">
                    {offerRideData.carbonImpact}
                  </p>
                  <p className="text-sm text-muted-foreground">CO₂ saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pool Ride Benefits */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-gradient">
                Pool Ride Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <DollarSign className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Extra Income</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn 40-60% more per trip with shared rides
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Route className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Optimized Routes</h4>
                      <p className="text-sm text-muted-foreground">
                        AI-powered route optimization for maximum efficiency
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Leaf className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Environmental Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduce carbon emissions by sharing rides
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Verified Passengers</h4>
                      <p className="text-sm text-muted-foreground">
                        All passengers are identity-verified for safety
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full glow" size="lg">
            <UserPlus className="mr-2 h-5 w-5" />
            Start Offering Pool Rides
          </Button>
        </div>
      )}
    </div>
  );
}
