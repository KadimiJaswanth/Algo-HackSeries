import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FiCalendar as Calendar,
  FiMapPin as MapPin,
  FiClock as Clock,
  FiDollarSign as DollarSign,
  FiStar as Star,
  FiDownload as Download,
  FiSearch as Search,
  FiFilter as Filter,
  FiUser as User,
  FiPhone as Phone,
} from "react-icons/fi";
import { FaCar as Car, FaBicycle as Bike, FaTruck as Truck } from "react-icons/fa";

interface RideHistoryItem {
  id: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  vehicleType: "bike" | "auto" | "car" | "premium";
  duration: number;
  distance: string;
  fare: number;
  driver: {
    name: string;
    rating: number;
    photo?: string;
  };
  rating: number;
  status: "completed" | "cancelled" | "refunded";
  paymentMethod: string;
  tripId: string;
}

const mockRideHistory: RideHistoryItem[] = [
  {
    id: "trip-001",
    date: "2024-01-15",
    time: "14:30",
    pickup: "Downtown Business District",
    dropoff: "International Airport",
    vehicleType: "premium",
    duration: 35,
    distance: "12.3 km",
    fare: 45.5,
    driver: {
      name: "John Smith",
      rating: 4.9,
    },
    rating: 5,
    status: "completed",
    paymentMethod: "USDC Wallet",
    tripId: "TXN-789456123",
  },
  {
    id: "trip-002",
    date: "2024-01-14",
    time: "09:15",
    pickup: "Home",
    dropoff: "Central Mall",
    vehicleType: "car",
    duration: 18,
    distance: "6.7 km",
    fare: 18.25,
    driver: {
      name: "Sarah Johnson",
      rating: 4.8,
    },
    rating: 4,
    status: "completed",
    paymentMethod: "USDC Wallet",
    tripId: "TXN-789456122",
  },
  {
    id: "trip-003",
    date: "2024-01-13",
    time: "19:45",
    pickup: "Office",
    dropoff: "Restaurant",
    vehicleType: "bike",
    duration: 12,
    distance: "3.2 km",
    fare: 8.75,
    driver: {
      name: "Mike Rodriguez",
      rating: 4.7,
    },
    rating: 5,
    status: "completed",
    paymentMethod: "USDC Wallet",
    tripId: "TXN-789456121",
  },
  {
    id: "trip-004",
    date: "2024-01-12",
    time: "16:20",
    pickup: "University",
    dropoff: "Home",
    vehicleType: "auto",
    duration: 25,
    distance: "8.9 km",
    fare: 15.25,
    driver: {
      name: "Lisa Chen",
      rating: 4.9,
    },
    rating: 0, // Not rated yet
    status: "completed",
    paymentMethod: "USDC Wallet",
    tripId: "TXN-789456120",
  },
  {
    id: "trip-005",
    date: "2024-01-10",
    time: "11:30",
    pickup: "Train Station",
    dropoff: "Hotel",
    vehicleType: "car",
    duration: 22,
    distance: "7.1 km",
    fare: 22.5,
    driver: {
      name: "David Kim",
      rating: 4.6,
    },
    rating: 3,
    status: "completed",
    paymentMethod: "USDC Wallet",
    tripId: "TXN-789456119",
  },
];

export default function RideHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVehicle, setFilterVehicle] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<RideHistoryItem | null>(
    null,
  );

  const filteredHistory = mockRideHistory.filter((trip) => {
    const matchesSearch =
      trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || trip.status === filterStatus;
    const matchesVehicle =
      filterVehicle === "all" || trip.vehicleType === filterVehicle;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="h-4 w-4 text-green-500" />;
      case "auto":
        return <Truck className="h-4 w-4 text-yellow-500" />;
      case "car":
        return <Car className="h-4 w-4 text-blue-500" />;
      case "premium":
        return <Car className="h-4 w-4 text-purple-500" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "refunded":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const generateReceipt = (trip: RideHistoryItem) => {
    const receiptData = `
RIDECHAIN RECEIPT
================
Trip ID: ${trip.tripId}
Date: ${formatDate(trip.date)} at ${trip.time}

RIDE DETAILS:
From: ${trip.pickup}
To: ${trip.dropoff}
Vehicle: ${trip.vehicleType.charAt(0).toUpperCase() + trip.vehicleType.slice(1)}
Duration: ${trip.duration} minutes
Distance: ${trip.distance}

DRIVER:
Name: ${trip.driver.name}
Rating: ${trip.driver.rating}/5.0

PAYMENT:
Fare: $${trip.fare.toFixed(2)} USDC
Payment Method: ${trip.paymentMethod}
Status: ${trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}

YOUR RATING: ${trip.rating > 0 ? `${trip.rating}/5 stars` : "Not rated"}

Thank you for using RideChain!
Powered by Avalanche Blockchain
================
    `;

    const blob = new Blob([receiptData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RideChain_Receipt_${trip.tripId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rateDriver = (tripId: string, rating: number) => {
    // In real app, this would update the blockchain
    alert(`Rated driver ${rating} stars! Rating stored on blockchain.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Ride History
          </CardTitle>
          <CardDescription>
            View all your completed rides and download receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips by location or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterVehicle} onValueChange={setFilterVehicle}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trip Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {filteredHistory.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                $
                {filteredHistory
                  .reduce((sum, trip) => sum + trip.fare, 0)
                  .toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredHistory.reduce((sum, trip) => sum + trip.duration, 0)}{" "}
                min
              </div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(
                  filteredHistory.reduce((sum, trip) => sum + trip.rating, 0) /
                    filteredHistory.filter((trip) => trip.rating > 0).length ||
                  0
                ).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>

          {/* Trip List */}
          <div className="space-y-4">
            {filteredHistory.map((trip) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Trip Header */}
                      <div className="flex items-center space-x-3">
                        {getVehicleIcon(trip.vehicleType)}
                        <div>
                          <div className="font-medium">
                            {formatDate(trip.date)} at {trip.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Trip ID: {trip.tripId}
                          </div>
                        </div>
                        <Badge
                          className={`text-white ${getStatusColor(trip.status)}`}
                        >
                          {trip.status.charAt(0).toUpperCase() +
                            trip.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Route */}
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <div className="h-8 w-0.5 bg-muted-foreground/30" />
                          <MapPin className="h-3 w-3 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{trip.pickup}</div>
                          <div className="text-sm text-muted-foreground my-2">
                            {trip.duration} min • {trip.distance}
                          </div>
                          <div className="font-medium">{trip.dropoff}</div>
                        </div>
                      </div>

                      {/* Driver & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {trip.driver.name}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{trip.driver.rating}</span>
                            </div>
                          </div>
                        </div>

                        {trip.rating === 0 ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground mr-2">
                              Rate driver:
                            </span>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => rateDriver(trip.id, rating)}
                                className="text-lg hover:text-yellow-500 transition-colors"
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">
                              You rated:
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= trip.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold">
                        ${trip.fare.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">USDC</div>
                      <div className="mt-2 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateReceipt(trip)}
                          className="w-full"
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Receipt
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="mr-2 h-3 w-3" />
                          Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>No trips found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
