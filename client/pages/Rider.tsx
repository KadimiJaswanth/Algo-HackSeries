import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car, MapPin, Wallet } from "lucide-react";

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
          <Button variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rider text-white">
                <MapPin className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Rider Dashboard</CardTitle>
              <CardDescription>
                Request rides and manage your transportation needs
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                This page is under development. Please continue prompting to build out the rider functionality, including:
              </p>
              <ul className="text-left space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
                <li>• Ride request form with pickup/dropoff locations</li>
                <li>• Real-time ride matching</li>
                <li>• Escrow payment system</li>
                <li>• Ride tracking and status updates</li>
                <li>• Rating and review system</li>
                <li>• Ride history from blockchain</li>
              </ul>
              <Link to="/">
                <Button variant="outline" className="mt-6">
                  Go Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
