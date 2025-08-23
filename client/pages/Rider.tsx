import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car, History, Star } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import RideRequestForm from "@/components/RideRequestForm";

export default function Rider() {
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Ride Request Form */}
          <div className="lg:col-span-2">
            <RideRequestForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Rides</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-semibold">$248.50</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Rides */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Rides</CardTitle>
                <Button variant="ghost" size="sm">
                  <History className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Downtown → Airport</div>
                      <div className="text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$24.50</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Home → Mall</div>
                      <div className="text-muted-foreground">Yesterday</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$12.75</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Office → Restaurant</div>
                      <div className="text-muted-foreground">3 days ago</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$8.25</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always verify driver details before getting in</li>
                  <li>• Keep your phone charged for tracking</li>
                  <li>• Rate your driver to help the community</li>
                  <li>• Payments are automatically handled via smart contract</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
