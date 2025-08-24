import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FiArrowLeft as ArrowLeft,
  FiGift as Gift,
  FiUsers as Users,
  FiVolume2 as Volume2,
  FiCalendar as Calendar,
  FiNavigation as Navigation,
  FiStar as Star,
  FiMapPin as MapPin,
  FiUser as User,
} from "react-icons/fi";
import { FaCar as Car, FaHistory as History } from "react-icons/fa";
import {
  FiGift,
  FiUsers,
  FiVolume2,
  FiCalendar,
  FiNavigation,
} from "react-icons/fi";
import { FaCrown as Crown } from "react-icons/fa";
import WalletConnect from "@/components/WalletConnect";
import RideBooking from "@/components/RideBooking";
import RideHistory from "@/components/RideHistory";
import RewardsSystem from "@/components/RewardsSystem";
import PoolRides from "@/components/PoolRides";
import AIFareNegotiation from "@/components/AIFareNegotiation";
import VoiceToRide from "@/components/VoiceToRide";
import ScheduledRides from "@/components/ScheduledRides";
import SubscriptionRides from "@/components/SubscriptionRides";
import SOSButton from "@/components/SOSButton";
import LiveTracking from "@/components/LiveTracking";
import SplitFare from "@/components/SplitFare";
import OnChainReview from "@/components/OnChainReview";
import PaymentInfo from "@/components/PaymentInfo";
import MapConfigInfo from "@/components/MapConfigInfo";
import GeoapifyStatus from "@/components/GeoapifyStatus";

export default function Rider() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("book");
  const [activeRideId] = useState("ride-123");
  const [currentFare] = useState(0.0005); // Default fare within token limits

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-glass-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 animate-slide-in-left">
            <Link to="/">
              <Button variant="ghost" size="sm" className="glass-hover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white glow">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gradient">RideChain</span>
              <span className="text-sm text-muted-foreground">Rider</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>
        </div>
      </header>

      <div className="container py-8 relative z-10">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-9 max-w-6xl glass animate-fade-in-up">
            <TabsTrigger
              value="book"
              className="flex items-center space-x-1 text-xs"
            >
              <MapPin className="h-3 w-3" />
              <span className="hidden sm:inline">Book</span>
            </TabsTrigger>
            <TabsTrigger
              value="pool"
              className="flex items-center space-x-1 text-xs"
            >
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Pool</span>
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="flex items-center space-x-1 text-xs"
            >
              <Volume2 className="h-3 w-3" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex items-center space-x-1 text-xs"
            >
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center space-x-1 text-xs"
            >
              <Crown className="h-3 w-3" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              className="flex items-center space-x-1 text-xs"
            >
              <Navigation className="h-3 w-3" />
              <span className="hidden sm:inline">Track</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center space-x-1 text-xs"
            >
              <Gift className="h-3 w-3" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-1 text-xs"
            >
              <History className="h-3 w-3" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-1 text-xs"
            >
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6 animate-fade-in-up">
            {/* Main Ride Booking */}
            <div className="w-full">
              <RideBooking onTabChange={setActiveTab} />
            </div>

            {/* Centered Wide Containers */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-2">
                  <AIFareNegotiation
                    basePrice={currentFare}
                    onFareAgreed={(price) =>
                      console.log(`Fare agreed: ${price.toFixed(4)} TOKENS`)
                    }
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-1 space-y-4">
                  <GoogleMapsStatus />
                  <SplitFare totalFare={currentFare} rideId={activeRideId} />
                  <PaymentInfo />
                </div>
              </div>

              {/* Emergency Contacts - Full Width */}
              <div className="w-full">
                <SOSButton />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pool" className="space-y-0 animate-fade-in-up">
            <PoolRides mode="find" />
          </TabsContent>

          <TabsContent value="voice" className="space-y-0 animate-fade-in-up">
            <VoiceToRide />
          </TabsContent>

          <TabsContent
            value="schedule"
            className="space-y-0 animate-fade-in-up"
          >
            <ScheduledRides />
          </TabsContent>

          <TabsContent
            value="subscription"
            className="space-y-0 animate-fade-in-up"
          >
            <SubscriptionRides />
          </TabsContent>

          <TabsContent
            value="tracking"
            className="space-y-0 animate-fade-in-up"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="mr-2 h-5 w-5" />
                  Live Tracking
                </CardTitle>
                <CardDescription>Track your ride in real-time</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Navigation className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No active ride to track
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a ride first, and tracking will appear here once the
                  driver accepts via SMS
                </p>
                <Button
                  onClick={() => setActiveTab("book")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Book a Ride
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-0 animate-fade-in-up">
            <RewardsSystem />
          </TabsContent>

          <TabsContent value="history" className="space-y-0 animate-fade-in-up">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RideHistory />
              </div>
              <div>
                <OnChainReview
                  targetId="driver-123"
                  targetType="driver"
                  targetName="Alex Rodriguez"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-0 animate-fade-in-up">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                        R
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Rider User</h3>
                        <p className="text-muted-foreground">
                          Member since January 2024
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-muted-foreground">
                          rider@example.com
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-muted-foreground">
                          +1 (555) 123-4567
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Emergency Contact
                        </label>
                        <p className="text-muted-foreground">
                          +1 (555) 987-6543
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Preferred Payment
                        </label>
                        <p className="text-muted-foreground">
                          Avalanche Wallet
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>Edit Profile</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Saved Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                            H
                          </div>
                          <div>
                            <div className="font-medium">Home</div>
                            <div className="text-sm text-muted-foreground">
                              123 Main Street, City
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                            W
                          </div>
                          <div>
                            <div className="font-medium">Work</div>
                            <div className="text-sm text-muted-foreground">
                              456 Business Ave, Downtown
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      <Button variant="outline" className="w-full">
                        Add New Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Rides
                      </span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Rating
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Spent
                      </span>
                      <span className="font-semibold">1.2485 TOKENS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Distance Traveled
                      </span>
                      <span className="font-semibold">387 km</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gold text-white flex items-center justify-center text-sm">
                          ⭐
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Excellent Rider
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Maintain 4.5+ rating
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                          🚗
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Frequent Rider
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Complete 25+ rides
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                          💚
                        </div>
                        <div>
                          <div className="font-medium text-sm">Eco Warrior</div>
                          <div className="text-xs text-muted-foreground">
                            Use bike rides 10+ times
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
