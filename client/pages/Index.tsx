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
  FiMapPin as MapPin,
  FiShield as Shield,
  FiZap as Zap,
  FiUsers as Users,
  FiStar as Star,
  FiChevronRight as ChevronRight,
} from "react-icons/fi";
import { FaCar as Car } from "react-icons/fa";
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
              to="/sms-test"
              className="text-sm hover:text-primary transition-colors glass-hover px-3 py-1 rounded-md"
            >
              SMS Test
            </Link>
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
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <Link to="/rider" className="block animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <Card className="cursor-pointer glass glass-hover glow-hover h-full group border-rider/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rider to-primary text-white glow group-hover:animate-float">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl text-gradient">I Need a Ride</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Book secure rides with crypto payments and on-chain
                    reputation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Shield className="mr-3 h-5 w-5 text-rider glow-accent" />
                      Escrow payments for security
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Zap className="mr-3 h-5 w-5 text-rider glow-accent" />
                      Instant crypto transactions
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Star className="mr-3 h-5 w-5 text-rider glow-accent" />
                      Blockchain-verified ratings
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-rider to-primary hover:from-primary hover:to-rider glow transition-all duration-300">
                    Start Riding
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/driver" className="block animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <Card className="cursor-pointer glass glass-hover glow-hover h-full group border-driver/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-driver to-accent text-white glow group-hover:animate-float">
                    <Car className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl text-gradient">I Want to Drive</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Earn crypto by providing rides with guaranteed payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Shield className="mr-3 h-5 w-5 text-driver glow-accent" />
                      Guaranteed payments via smart contracts
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Zap className="mr-3 h-5 w-5 text-driver glow-accent" />
                      Instant crypto earnings
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Users className="mr-3 h-5 w-5 text-driver glow-accent" />
                      Build on-chain reputation
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-driver to-accent hover:from-accent hover:to-driver glow transition-all duration-300">
                    Start Driving
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/security" className="block animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
              <Card className="cursor-pointer glass glass-hover glow-hover h-full group border-primary/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white glow group-hover:animate-float">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl text-gradient">Security Center</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enterprise-grade security monitoring and protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Shield className="mr-3 h-5 w-5 text-primary glow-accent" />
                      Real-time threat detection
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Zap className="mr-3 h-5 w-5 text-primary glow-accent" />
                      Instant security response
                    </li>
                    <li className="flex items-center glass-hover px-2 py-1 rounded-md">
                      <Star className="mr-3 h-5 w-5 text-primary glow-accent" />
                      95% security score
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary glow transition-all duration-300">
                    View Security
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="absolute inset-0 glass"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Why Choose RideChain?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits of decentralized transportation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center glass glass-hover p-6 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white glow animate-float">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gradient">Secure Escrow</h3>
              <p className="text-muted-foreground">
                Smart contracts hold payments in escrow until ride completion,
                ensuring security for both parties.
              </p>
            </div>

            <div className="text-center glass glass-hover p-6 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-accent to-warning text-white glow animate-float" style={{ animationDelay: '1s' }}>
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gradient">
                On-Chain Reputation
              </h3>
              <p className="text-muted-foreground">
                Ratings and reviews stored as NFTs, creating a permanent and
                verifiable reputation system.
              </p>
            </div>

            <div className="text-center glass glass-hover p-6 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-warning to-primary text-white glow animate-float" style={{ animationDelay: '2s' }}>
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gradient">Instant Payments</h3>
              <p className="text-muted-foreground">
                Automatic crypto payments powered by Avalanche's fast and
                low-cost transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-glass-border z-10">
        <div className="absolute inset-0 glass"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4 animate-fade-in-up">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white glow">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gradient">RideChain</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Decentralized ride-sharing powered by Avalanche blockchain
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="glass-hover px-3 py-1 rounded-md transition-all duration-300 hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="glass-hover px-3 py-1 rounded-md transition-all duration-300 hover:text-primary">
              Terms
            </Link>
            <Link to="/support" className="glass-hover px-3 py-1 rounded-md transition-all duration-300 hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
