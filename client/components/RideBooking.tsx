import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FiMapPin as MapPin,
  FiClock as Clock,
  FiDollarSign as DollarSign,
  FiAlertCircle as AlertCircle,
  FiPlus as Plus,
  FiX as X,
  FiCalendar as Calendar,
  FiUsers as Users,
  FiShield as Shield,
  FiShare2 as Share2,
  FiPhone as Phone,
  FiHeart as Heart,
  FiStar as Star,
  FiNavigation as Navigation,
  FiMap as Route,
  FiClock as Timer,
  FiZap as Zap,
} from "react-icons/fi";
import { FaCar as Car } from "react-icons/fa";
import { useAccount } from "wagmi";
import VehicleSelection from "./VehicleSelection";
import GoogleMaps from "./GoogleMaps";
import RideStatus from "./RideStatus";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Stop {
  id: string;
  location: Location;
  duration: number; // minutes to wait
}

interface RideBookingData {
  pickup: Location | null;
  dropoff: Location | null;
  stops: Stop[];
  vehicleType: string;
  scheduledTime: string;
  isScheduled: boolean;
  passengers: number;
  notes: string;
  fareEstimate: number;
  isRoundTrip: boolean;
  emergencyContact: string;
  shareTrip: boolean;
  promoCode: string;
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

export default function RideBooking() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("book");
  const [isLoading, setIsLoading] = useState(false);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);

  const [bookingData, setBookingData] = useState<RideBookingData>({
    pickup: null,
    dropoff: null,
    stops: [],
    vehicleType: "",
    scheduledTime: "",
    isScheduled: false,
    passengers: 1,
    notes: "",
    fareEstimate: 0,
    isRoundTrip: false,
    emergencyContact: "",
    shareTrip: false,
    promoCode: "",
  });

  // Simulate surge pricing
  useEffect(() => {
    const updateSurge = () => {
      const hour = new Date().getHours();
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        setSurgeMultiplier(1.5 + Math.random() * 0.5); // Peak hours
      } else if (hour >= 22 || hour <= 5) {
        setSurgeMultiplier(1.2 + Math.random() * 0.3); // Late night
      } else {
        setSurgeMultiplier(1 + Math.random() * 0.2); // Normal hours
      }
    };

    updateSurge();
    const interval = setInterval(updateSurge, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (pickup: Location, dropoff: Location): number => {
    // Simple distance calculation (in real app, use Google Maps Distance Matrix API)
    const R = 6371; // Earth's radius in km
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
    const dLon = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((dropoff.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSelect = (
    location: Location,
    type: "pickup" | "dropoff",
  ) => {
    setBookingData((prev) => ({
      ...prev,
      [type]: location,
    }));
  };

  const handleVehicleSelect = (vehicleId: string, fareEstimate: number) => {
    setBookingData((prev) => ({
      ...prev,
      vehicleType: vehicleId,
      fareEstimate,
    }));
  };

  const addStop = () => {
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      location: {
        lat: 0,
        lng: 0,
        address: "",
      },
      duration: 3,
    };
    setBookingData((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop],
    }));
  };

  const removeStop = (stopId: string) => {
    setBookingData((prev) => ({
      ...prev,
      stops: prev.stops.filter((stop) => stop.id !== stopId),
    }));
  };

  const handleBookRide = async () => {
    if (!isConnected && !isDemoMode()) {
      alert("Please connect your wallet or try demo mode");
      return;
    }

    if (
      !bookingData.pickup ||
      !bookingData.dropoff ||
      !bookingData.vehicleType
    ) {
      alert(
        "Please select pickup location, dropoff location, and vehicle type",
      );
      return;
    }

    setIsLoading(true);

    try {
      // Create ride with enhanced details
      const rideId = `ride-${Date.now()}`;
      const newRide: ActiveRide = {
        id: rideId,
        status: "searching",
        pickup: bookingData.pickup.address,
        dropoff: bookingData.dropoff.address,
        price: bookingData.fareEstimate,
      };

      setActiveRide(newRide);
      setActiveTab("track");
      setIsLoading(false);

      // Simulate ride workflow
      simulateRideWorkflow(newRide);
    } catch (error) {
      console.error("Error booking ride:", error);
      alert("Error booking ride. Please try again.");
      setIsLoading(false);
    }
  };

  const simulateRideWorkflow = (ride: ActiveRide) => {
    // Find driver
    setTimeout(
      () => {
        const driver = {
          name: getRandomDriverName(),
          rating: 4.5 + Math.random() * 0.5,
          carModel: getRandomCarModel(),
          licensePlate: generateLicensePlate(),
          eta: Math.floor(Math.random() * 8) + 3,
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
      3000 + Math.random() * 2000,
    );

    // Driver pickup
    setTimeout(() => {
      setActiveRide((prev) => (prev ? { ...prev, status: "pickup" } : null));
    }, 8000);

    // Ride in progress
    setTimeout(() => {
      setActiveRide((prev) =>
        prev ? { ...prev, status: "in_progress" } : null,
      );
    }, 15000);

    // Ride completion
    setTimeout(() => {
      setActiveRide((prev) => (prev ? { ...prev, status: "completed" } : null));
    }, 25000);
  };

  const isDemoMode = () => !isConnected;

  const getRandomDriverName = () => {
    const names = [
      "John Smith",
      "Sarah Johnson",
      "Mike Brown",
      "Lisa Davis",
      "David Wilson",
      "Emma Garcia",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomCarModel = () => {
    const cars = [
      "Toyota Camry",
      "Honda Civic",
      "Nissan Altima",
      "Ford Focus",
      "Hyundai Elantra",
      "Chevrolet Malibu",
    ];
    return cars[Math.floor(Math.random() * cars.length)];
  };

  const generateLicensePlate = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}-${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    setActiveTab("book");
  };

  const handleCompleteRide = () => {
    alert("Ride completed! Payment processed via smart contract.");
    setActiveRide(null);
    setActiveTab("book");
  };

  const handleRateDriver = (rating: number) => {
    alert(`Thank you for rating ${rating} stars! Rating stored on blockchain.`);
    handleCompleteRide();
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>Connect Wallet or Try Demo</CardTitle>
          <CardDescription>
            Connect your Web3 wallet for full features or try our demo mode
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button
            onClick={() =>
              setBookingData((prev) => ({
                ...prev,
                pickup: {
                  lat: 37.7749,
                  lng: -122.4194,
                  address: "Downtown San Francisco",
                },
                dropoff: {
                  lat: 37.6213,
                  lng: -122.379,
                  address: "San Francisco Airport",
                },
              }))
            }
          >
            🚀 Try Demo Mode
          </Button>
          <p className="text-sm text-muted-foreground">
            Experience the full ride-booking workflow without wallet connection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book Ride</TabsTrigger>
          <TabsTrigger value="track" disabled={!activeRide}>
            Track Ride
          </TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          {/* Map View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                Select Locations
              </CardTitle>
              <CardDescription>
                Tap on the map to set pickup and dropoff locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleMaps
                pickup={bookingData.pickup}
                dropoff={bookingData.dropoff}
                onLocationSelect={handleLocationSelect}
                mode="select"
                className="w-full h-80 rounded-lg border"
              />
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup-address">Pickup Location</Label>
                  <Input
                    id="pickup-address"
                    value={bookingData.pickup?.address || ""}
                    placeholder="Enter pickup address"
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        pickup: prev.pickup
                          ? { ...prev.pickup, address: e.target.value }
                          : null,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dropoff-address">Dropoff Location</Label>
                  <Input
                    id="dropoff-address"
                    value={bookingData.dropoff?.address || ""}
                    placeholder="Enter destination address"
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        dropoff: prev.dropoff
                          ? { ...prev.dropoff, address: e.target.value }
                          : null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Multiple Stops */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Additional Stops</Label>
                  <Button variant="outline" size="sm" onClick={addStop}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stop
                  </Button>
                </div>
                {bookingData.stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Input
                      placeholder={`Stop ${index + 1} address`}
                      value={stop.location.address}
                      onChange={(e) => {
                        const updatedStops = bookingData.stops.map((s) =>
                          s.id === stop.id
                            ? {
                                ...s,
                                location: {
                                  ...s.location,
                                  address: e.target.value,
                                },
                              }
                            : s,
                        );
                        setBookingData((prev) => ({
                          ...prev,
                          stops: updatedStops,
                        }));
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Wait time (min)"
                      value={stop.duration}
                      onChange={(e) => {
                        const updatedStops = bookingData.stops.map((s) =>
                          s.id === stop.id
                            ? { ...s, duration: parseInt(e.target.value) || 0 }
                            : s,
                        );
                        setBookingData((prev) => ({
                          ...prev,
                          stops: updatedStops,
                        }));
                      }}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStop(stop.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Trip Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scheduled"
                    checked={bookingData.isScheduled}
                    onCheckedChange={(checked) =>
                      setBookingData((prev) => ({
                        ...prev,
                        isScheduled: checked,
                      }))
                    }
                  />
                  <Label htmlFor="scheduled">Schedule for later</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="round-trip"
                    checked={bookingData.isRoundTrip}
                    onCheckedChange={(checked) =>
                      setBookingData((prev) => ({
                        ...prev,
                        isRoundTrip: checked,
                      }))
                    }
                  />
                  <Label htmlFor="round-trip">Round trip</Label>
                </div>
              </div>

              {bookingData.isScheduled && (
                <div>
                  <Label htmlFor="scheduled-time">Scheduled Time</Label>
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={bookingData.scheduledTime}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        scheduledTime: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passengers">Number of Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max="8"
                    value={bookingData.passengers}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        passengers: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input
                    id="promo-code"
                    placeholder="Enter promo code"
                    value={bookingData.promoCode}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        promoCode: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for the driver..."
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Selection */}
          {bookingData.pickup && bookingData.dropoff && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Ride</CardTitle>
                <CardDescription>
                  {surgeMultiplier > 1.2 && (
                    <Badge variant="destructive" className="mb-2">
                      <Zap className="mr-1 h-3 w-3" />
                      High demand in your area
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleSelection
                  distance={calculateDistance(
                    bookingData.pickup,
                    bookingData.dropoff,
                  )}
                  duration={Math.round(
                    calculateDistance(bookingData.pickup, bookingData.dropoff) *
                      2.5,
                  )}
                  selectedVehicle={bookingData.vehicleType}
                  onVehicleSelect={handleVehicleSelect}
                  surgeMultiplier={surgeMultiplier}
                />
              </CardContent>
            </Card>
          )}

          {/* Safety & Sharing Options */}
          {bookingData.vehicleType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Safety & Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    placeholder="Phone number for emergency contact"
                    value={bookingData.emergencyContact}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        emergencyContact: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-trip"
                    checked={bookingData.shareTrip}
                    onCheckedChange={(checked) =>
                      setBookingData((prev) => ({
                        ...prev,
                        shareTrip: checked,
                      }))
                    }
                  />
                  <Label htmlFor="share-trip" className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share trip details with emergency contact
                  </Label>
                </div>

                {/* Price Breakdown */}
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Price Breakdown</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base fare</span>
                      <span>
                        $
                        {(
                          (bookingData.fareEstimate / surgeMultiplier) *
                          0.4
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance & time</span>
                      <span>
                        $
                        {(
                          (bookingData.fareEstimate / surgeMultiplier) *
                          0.6
                        ).toFixed(2)}
                      </span>
                    </div>
                    {surgeMultiplier > 1 && (
                      <div className="flex justify-between text-red-600">
                        <span>
                          Surge pricing ({surgeMultiplier.toFixed(1)}x)
                        </span>
                        <span>
                          +$
                          {(
                            bookingData.fareEstimate -
                            bookingData.fareEstimate / surgeMultiplier
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {bookingData.isRoundTrip && (
                      <div className="flex justify-between">
                        <span>Return trip</span>
                        <span>+${bookingData.fareEstimate.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          bookingData.fareEstimate *
                          (bookingData.isRoundTrip ? 2 : 1)
                        ).toFixed(2)}{" "}
                        USDC
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBookRide}
                  disabled={isLoading || !bookingData.vehicleType}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Booking Ride...
                    </>
                  ) : (
                    <>
                      <Car className="mr-2 h-4 w-4" />
                      Confirm & Book Ride
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="track">
          {activeRide ? (
            <RideStatus
              ride={activeRide}
              onCancel={handleCancelRide}
              onComplete={handleCompleteRide}
              onRate={handleRateDriver}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active ride</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Scheduled Rides
              </CardTitle>
              <CardDescription>
                Manage your upcoming scheduled rides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>No scheduled rides</p>
                <p className="text-sm">Book a ride and schedule it for later</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
