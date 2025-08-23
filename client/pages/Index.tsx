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
import { Badge } from "@/components/ui/badge";
import {
  Car,
  MapPin,
  Shield,
  Zap,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

export default function Index() {
  const [userType, setUserType] = useState<"rider" | "driver" | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/15 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-glass-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white glow">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gradient">RideChain</span>
            <Badge variant="outline" className="ml-2 text-xs glass-hover glow-accent">
              Avalanche
            </Badge>
          </div>
          <nav className="flex items-center space-x-6 animate-slide-in-right">
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-all duration-300 glass-hover px-3 py-1 rounded-md"
            >
              About
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-all duration-300 glass-hover px-3 py-1 rounded-md"
            >
              How it Works
            </Link>
            <WalletConnect />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 glass glow-accent animate-fade-in-down" variant="secondary">
            Powered by Avalanche C-Chain
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 animate-fade-in-up text-glow">
            Decentralized
            <br />
            Ride Sharing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            The future of transportation is here. Secure, transparent, and
            trustless ride-sharing powered by smart contracts and blockchain
            technology.
          </p>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Link to="/rider" className="block">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-rider hover:bg-rider/5 h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rider text-white">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">I Need a Ride</CardTitle>
                  <CardDescription>
                    Book secure rides with crypto payments and on-chain
                    reputation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-rider" />
                      Escrow payments for security
                    </li>
                    <li className="flex items-center">
                      <Zap className="mr-2 h-4 w-4 text-rider" />
                      Instant crypto transactions
                    </li>
                    <li className="flex items-center">
                      <Star className="mr-2 h-4 w-4 text-rider" />
                      Blockchain-verified ratings
                    </li>
                  </ul>
                  <Button className="w-full bg-rider hover:bg-rider/90">
                    Start Riding
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/driver" className="block">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-driver hover:bg-driver/5 h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-driver text-white">
                    <Car className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">I Want to Drive</CardTitle>
                  <CardDescription>
                    Earn crypto by providing rides with guaranteed payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-driver" />
                      Guaranteed payments via smart contracts
                    </li>
                    <li className="flex items-center">
                      <Zap className="mr-2 h-4 w-4 text-driver" />
                      Instant crypto earnings
                    </li>
                    <li className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-driver" />
                      Build on-chain reputation
                    </li>
                  </ul>
                  <Button className="w-full bg-driver hover:bg-driver/90">
                    Start Driving
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose RideChain?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits of decentralized transportation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Escrow</h3>
              <p className="text-muted-foreground">
                Smart contracts hold payments in escrow until ride completion,
                ensuring security for both parties.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                On-Chain Reputation
              </h3>
              <p className="text-muted-foreground">
                Ratings and reviews stored as NFTs, creating a permanent and
                verifiable reputation system.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning text-warning-foreground">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Payments</h3>
              <p className="text-muted-foreground">
                Automatic crypto payments powered by Avalanche's fast and
                low-cost transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">RideChain</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Decentralized ride-sharing powered by Avalanche blockchain
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/support" className="hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
