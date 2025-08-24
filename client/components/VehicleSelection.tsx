import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FiClock as Clock,
  FiUsers as Users,
  FiZap as Zap,
  FiTruck as Truck,
  FiCheckCircle as CheckCircle,
} from "react-icons/fi";
import { FaCar as Car, FaBicycle as Bike } from "react-icons/fa";

interface VehicleType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMin: number;
  capacity: number;
  eta: string;
  features: string[];
  category: "bike" | "auto" | "car" | "premium";
}

const vehicleTypes: VehicleType[] = [
  {
    id: "bike",
    name: "RideBike",
    icon: <Bike className="h-6 w-6" />,
    description: "Quick & affordable bike rides",
    basePrice: 0.0001,
    pricePerKm: 0.00005,
    pricePerMin: 0.00002,
    capacity: 1,
    eta: "2-5 min",
    features: ["Fastest arrival", "Best for short trips", "Affordable"],
    category: "bike",
  },
  {
    id: "auto",
    name: "RideAuto",
    icon: <Truck className="h-6 w-6" />,
    description: "Comfortable auto-rickshaw",
    basePrice: 0.0002,
    pricePerKm: 0.00008,
    pricePerMin: 0.00003,
    capacity: 3,
    eta: "3-8 min",
    features: ["AC available", "Good for city rides", "Moderate pricing"],
    category: "auto",
  },
  {
    id: "economy",
    name: "RideGo",
    icon: <Car className="h-6 w-6" />,
    description: "Affordable car rides",
    basePrice: 0.0003,
    pricePerKm: 0.00012,
    pricePerMin: 0.00005,
    capacity: 4,
    eta: "5-12 min",
    features: ["AC car", "Safe & reliable", "Budget-friendly"],
    category: "car",
  },
  {
    id: "comfort",
    name: "RideComfort",
    icon: <Car className="h-6 w-6" />,
    description: "More spacious rides",
    basePrice: 0.0004,
    pricePerKm: 0.00015,
    pricePerMin: 0.00007,
    capacity: 4,
    eta: "6-15 min",
    features: ["Spacious cars", "Professional drivers", "Extra legroom"],
    category: "car",
  },
  {
    id: "premium",
    name: "RidePremium",
    icon: <Car className="h-6 w-6" />,
    description: "Luxury car experience",
    basePrice: 0.0005,
    pricePerKm: 0.0002,
    pricePerMin: 0.0001,
    capacity: 4,
    eta: "8-20 min",
    features: ["Luxury cars", "Top-rated drivers", "Premium service"],
    category: "premium",
  },
  {
    id: "xl",
    name: "RideXL",
    icon: <Truck className="h-6 w-6" />,
    description: "Large group rides",
    basePrice: 0.0004,
    pricePerKm: 0.00018,
    pricePerMin: 0.00008,
    capacity: 6,
    eta: "10-25 min",
    features: ["6+ seater", "Extra luggage space", "Group rides"],
    category: "car",
  },
];

interface VehicleSelectionProps {
  distance?: number; // in km
  duration?: number; // in minutes
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string, fareEstimate: number) => void;
  surgeMultiplier?: number;
  onBookRide?: (vehicleId: string, vehicleName: string, fare: number) => void;
}

export default function VehicleSelection({
  distance = 5,
  duration = 15,
  selectedVehicle,
  onVehicleSelect,
  surgeMultiplier = 1,
  onBookRide,
}: VehicleSelectionProps) {
  const navigate = useNavigate();
  const [bookedVehicle, setBookedVehicle] = useState<string | null>(null);
  const calculateFare = (vehicle: VehicleType): number => {
    const baseFare = vehicle.basePrice;
    const distanceFare = distance * vehicle.pricePerKm;
    const timeFare = duration * vehicle.pricePerMin;
    const subtotal = baseFare + distanceFare + timeFare;
    return Math.round(subtotal * surgeMultiplier * 10000) / 10000;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "bike":
        return "bg-green-500";
      case "auto":
        return "bg-yellow-500";
      case "car":
        return "bg-blue-500";
      case "premium":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Choose a ride</h3>
        {surgeMultiplier > 1 && (
          <Badge variant="destructive" className="animate-pulse">
            <Zap className="mr-1 h-3 w-3" />
            {surgeMultiplier}x Surge Pricing
          </Badge>
        )}
      </div>

      {vehicleTypes.map((vehicle) => {
        const fare = calculateFare(vehicle);
        const isSelected = selectedVehicle === vehicle.id;

        return (
          <Card
            key={vehicle.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onVehicleSelect(vehicle.id, fare)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg text-white ${getCategoryColor(vehicle.category)}`}
                  >
                    {vehicle.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{vehicle.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {vehicle.capacity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {vehicle.eta}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vehicle.features.slice(0, 2).join(" • ")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="text-lg font-bold">
                    {fare.toFixed(6)} TOKENS
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Blockchain
                  </div>
                  {surgeMultiplier > 1 && (
                    <div className="text-xs text-red-600">
                      +{(fare - fare / surgeMultiplier).toFixed(6)} TOKENS surge
                    </div>
                  )}

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to confirmation page with ride details
                      const params = new URLSearchParams({
                        vehicleId: vehicle.id,
                        vehicleName: vehicle.name,
                        fare: fare.toString(),
                        estimatedTime: vehicle.eta,
                      });
                      navigate(`/book-ride-confirmation?${params.toString()}`);
                      onBookRide?.(vehicle.id, vehicle.name, fare);
                    }}
                    className="w-full"
                  >
                    Book Ride
                  </Button>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="text-muted-foreground">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Base: {vehicle.basePrice.toFixed(6)} + Distance:
                    {(distance * vehicle.pricePerKm).toFixed(6)} + Time:
                    {(duration * vehicle.pricePerMin).toFixed(6)} TOKENS
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
