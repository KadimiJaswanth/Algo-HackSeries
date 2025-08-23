import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Car, History, Star, MapPin, User } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import RideBooking from "@/components/RideBooking";
import RideHistory from "@/components/RideHistory";

export default function Rider() {
  const [activeTab, setActiveTab] = useState("book");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-rider/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">RideChain</span>
              <span className="text-sm text-muted-foreground">Rider</span>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="container py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="book" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Book Ride</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-0">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Enhanced Ride Booking */}
              <div className="lg:col-span-3">
                <RideBooking />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-0">
            <RideHistory />
          </TabsContent>

          <TabsContent value="profile" className="space-y-0">
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
                        <p className="text-muted-foreground">USDC Wallet</p>
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
                      <span className="font-semibold">$1,248.50</span>
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
