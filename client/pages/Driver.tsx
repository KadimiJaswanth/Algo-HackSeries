import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car, DollarSign, Star, TrendingUp } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import DriverDashboard from "@/components/DriverDashboard";

export default function Driver() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-driver/5">
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
              <span className="text-sm text-muted-foreground">Driver</span>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Driver Dashboard */}
          <div className="lg:col-span-2">
            <DriverDashboard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-driver">$127.50</div>
                  <div className="text-sm text-muted-foreground">8 rides completed</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base Earnings</span>
                    <span>$115.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tips</span>
                    <span>$12.50</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bonus</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Rides</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                  <span className="font-semibold">$3,247.85</span>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-driver" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monday</span>
                    <span className="font-medium">$89.25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tuesday</span>
                    <span className="font-medium">$124.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Wednesday</span>
                    <span className="font-medium">$156.75</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Thursday</span>
                    <span className="font-medium">$98.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Friday</span>
                    <span className="font-medium">$167.25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">$203.50</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Weekly Total</span>
                    <span className="font-bold text-driver">$839.25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips for Drivers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Driver Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keep your vehicle clean and comfortable</li>
                  <li>• Arrive at pickup location promptly</li>
                  <li>• Maintain good communication with riders</li>
                  <li>• Earnings are automatically sent to your wallet</li>
                  <li>• High ratings lead to more ride requests</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
