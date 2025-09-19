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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Car,
  DollarSign,
  Star,
  TrendingUp,
  Shield,
  Navigation,
  Zap,
  Leaf,
  Clock,
  MapPin,
  UserCheck,
  CreditCard,
  Camera,
  FileText,
  CheckCircle,
  AlertTriangle,
  Route,
  Battery,
  Globe,
  Settings,
  Award,
  Target,
  BarChart3,
  Users,
  Phone,
  Video,
  Mic,
  Eye,
  Heart,
  TreePine,
  Fuel,
  Calendar,
  Bell,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Home,
} from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import DriverDashboard from "@/components/DriverDashboard";
import DriverNotification, {
  useDriverNotifications,
} from "@/components/DriverNotification";
import { useEffect, useState } from "react";

export default function Driver() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOnline, setIsOnline] = useState(false);
  const [drivingMode, setDrivingMode] = useState("standard");
  const [kycStatus, setKycStatus] = useState("pending"); // pending, verified, rejected
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isEVDriver, setIsEVDriver] = useState(false);

  // Driver notification system
  const {
    currentNotification,
    showNotification,
    addNotification,
    handleAccept,
    handleIgnore,
    closeNotification,
  } = useDriverNotifications();

  // Simulate ride requests when driver goes online
  useEffect(() => {
    if (!isOnline) return;

    const simulateRideRequest = () => {
      const mockRequests = [
        {
          id: `ride-${Date.now()}`,
          riderId: "rider-123",
          riderName: "Sarah Johnson",
          pickupLocation: "Downtown Business District, Main St & 5th Ave",
          dropoffLocation: "Airport Terminal 2, Departure Level",
          estimatedFare: 0.0008,
          distance: 12.5,
          estimatedDuration: 25,
          vehicleType: "economy",
          timestamp: new Date(),
          urgency: "normal" as const,
        },
        {
          id: `ride-${Date.now() + 1}`,
          riderId: "rider-456",
          riderName: "Mike Chen",
          pickupLocation: "Central Shopping Mall, Parking Lot B",
          dropoffLocation: "University Campus, Student Center",
          estimatedFare: 0.0003,
          distance: 5.8,
          estimatedDuration: 15,
          vehicleType: "bike",
          timestamp: new Date(),
          urgency: "high" as const,
        },
        {
          id: `ride-${Date.now() + 2}`,
          riderId: "rider-789",
          riderName: "Emily Rodriguez",
          pickupLocation: "Hospital Emergency Entrance",
          dropoffLocation: "Pharmacy & Medical Center, Oak Street",
          estimatedFare: 0.0002,
          distance: 3.2,
          estimatedDuration: 8,
          vehicleType: "auto",
          timestamp: new Date(),
          urgency: "urgent" as const,
        },
      ];

      const randomRequest =
        mockRequests[Math.floor(Math.random() * mockRequests.length)];
      addNotification({
        ...randomRequest,
        id: `ride-${Date.now()}-${Math.random()}`,
      });
    };

    // Simulate first request after 3 seconds of going online
    const initialTimeout = setTimeout(simulateRideRequest, 3000);

    // Then simulate random requests every 30-60 seconds
    const interval = setInterval(
      () => {
        if (Math.random() > 0.3) {
          // 70% chance of getting a request
          simulateRideRequest();
        }
      },
      Math.random() * 30000 + 30000,
    ); // 30-60 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isOnline, addNotification]);

  // Mock data
  const todayEarnings = 127.5;
  const weeklyEarnings = 839.25;
  const totalRides = 156;
  const rating = 4.9;
  const acceptanceRate = 94;
  const evPoints = 1250;
  const safetyScore = 98;

  const onboardingSteps = [
    { id: 1, title: "Personal Info", completed: true },
    { id: 2, title: "Vehicle Details", completed: true },
    { id: 3, title: "Document Upload", completed: true },
    { id: 4, title: "Background Check", completed: false },
    { id: 5, title: "Vehicle Inspection", completed: false },
  ];

  const drivingModes = [
    {
      id: "standard",
      name: "Standard",
      description: "Regular rides, all vehicle types",
      icon: Car,
    },
    {
      id: "premium",
      name: "Premium Only",
      description: "High-end rides, premium vehicles",
      icon: Star,
    },
    {
      id: "eco",
      name: "Eco Mode",
      description: "Short rides, fuel efficient",
      icon: Leaf,
    },
    {
      id: "long",
      name: "Long Distance",
      description: "Airport & intercity rides",
      icon: Route,
    },
    {
      id: "night",
      name: "Night Shift",
      description: "10PM - 6AM rides",
      icon: Clock,
    },
    {
      id: "pool",
      name: "Pool Focus",
      description: "Shared rides priority",
      icon: Users,
    },
  ];

  const safetyFeatures = [
    { name: "Emergency Button", status: "active", icon: AlertTriangle },
    { name: "Live Tracking", status: "active", icon: Navigation },
    { name: "Trip Recording", status: "active", icon: Video },
    { name: "Speed Monitoring", status: "active", icon: Target },
    { name: "Night Vision", status: "inactive", icon: Eye },
    { name: "Driver Health", status: "active", icon: Heart },
  ];

  const routeSuggestions = [
    {
      area: "Downtown Business District",
      demand: "High",
      surge: 1.8,
      distance: "2.3 km",
      eta: "7 min",
    },
    {
      area: "Airport Terminal",
      demand: "Medium",
      surge: 1.2,
      distance: "12.8 km",
      eta: "18 min",
    },
    {
      area: "University Campus",
      demand: "High",
      surge: 1.5,
      distance: "5.1 km",
      eta: "12 min",
    },
  ];

  const evRewards = [
    { action: "Complete 10 EV rides", points: 100, progress: 7 },
    { action: "Drive 100km emission-free", points: 200, progress: 67 },
    { action: "Charge at partner stations", points: 50, progress: 12 },
    { action: "Refer EV driver", points: 500, progress: 0 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-driver/5 to-accent/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-driver/20 rounded-full blur-3xl animate-float"></div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-driver to-accent text-white glow">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gradient">RideChain</span>
              <span className="text-sm text-muted-foreground">Driver</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Online Status Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="online-status" className="text-sm">
                {isOnline ? "Online" : "Offline"}
              </Label>
              <Switch
                id="online-status"
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
              {isOnline && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
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
          <TabsList className="grid w-full grid-cols-6 max-w-4xl glass animate-fade-in-up">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-1 text-xs"
            >
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="onboarding"
              className="flex items-center space-x-1 text-xs"
            >
              <UserCheck className="h-3 w-3" />
              <span className="hidden sm:inline">Onboarding</span>
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="flex items-center space-x-1 text-xs"
            >
              <DollarSign className="h-3 w-3" />
              <span className="hidden sm:inline">Earnings</span>
            </TabsTrigger>
            <TabsTrigger
              value="safety"
              className="flex items-center space-x-1 text-xs"
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Safety</span>
            </TabsTrigger>
            <TabsTrigger
              value="routes"
              className="flex items-center space-x-1 text-xs"
            >
              <Navigation className="h-3 w-3" />
              <span className="hidden sm:inline">Routes</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center space-x-1 text-xs"
            >
              <Leaf className="h-3 w-3" />
              <span className="hidden sm:inline">EV Rewards</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent
            value="dashboard"
            className="space-y-6 animate-fade-in-up"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Driver Dashboard */}
              <div className="lg:col-span-2">
                <DriverDashboard />
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="glass">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-driver">
                        ${todayEarnings}
                      </div>
                      <div className="text-sm text-muted-foreground">Today</div>
                    </CardContent>
                  </Card>
                  <Card className="glass">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {totalRides}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Rides
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Driving Mode Selector */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gradient">
                      Driving Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {drivingModes.slice(0, 3).map((mode) => (
                        <Button
                          key={mode.id}
                          variant={
                            drivingMode === mode.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setDrivingMode(mode.id)}
                          className="justify-start glass-hover"
                        >
                          <mode.icon className="mr-2 h-4 w-4" />
                          {mode.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Score */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-gradient">
                      <Shield className="mr-2 h-5 w-5" />
                      Safety Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">
                        {safetyScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Excellent
                      </div>
                      <Progress value={safetyScore} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Onboarding & KYC Tab */}
          <TabsContent
            value="onboarding"
            className="space-y-6 animate-fade-in-up"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Instant Onboarding & KYC
                </CardTitle>
                <CardDescription>
                  Complete your profile to start driving and earning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* KYC Status */}
                <div className="flex items-center justify-between p-4 rounded-lg border glass">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        kycStatus === "verified"
                          ? "bg-green-500/20"
                          : kycStatus === "pending"
                            ? "bg-yellow-500/20"
                            : "bg-red-500/20"
                      }`}
                    >
                      {kycStatus === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : kycStatus === "pending" ? (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">KYC Verification</div>
                      <div className="text-sm text-muted-foreground">
                        {kycStatus === "verified"
                          ? "Verified"
                          : kycStatus === "pending"
                            ? "Under Review"
                            : "Action Required"}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      kycStatus === "verified"
                        ? "default"
                        : kycStatus === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {kycStatus}
                  </Badge>
                </div>

                {/* Onboarding Steps */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Onboarding Progress</h3>
                  {onboardingSteps.map((step) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            step.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                      {!step.completed && (
                        <Button size="sm" variant="outline">
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button className="glass-hover">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" className="glass-hover">
                    <FileText className="mr-2 h-4 w-4" />
                    View Requirements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Earnings Tab */}
          <TabsContent
            value="earnings"
            className="space-y-6 animate-fade-in-up"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Earnings Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                {/* Earnings Overview */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-gradient">
                      Earnings Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-driver">
                          ${todayEarnings}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Today
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          ${weeklyEarnings}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          This Week
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          $3,247
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Breakdown */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Today's Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Base Earnings (8 rides)</span>
                        <span className="font-medium">$115.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tips</span>
                        <span className="font-medium text-green-600">
                          +$12.50
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surge Bonus</span>
                        <span className="font-medium text-blue-600">
                          +$8.75
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>EV Bonus</span>
                        <span className="font-medium text-green-600">
                          +$5.25
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-driver">${todayEarnings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-2xl font-bold">{rating}</div>
                        <div className="text-sm text-muted-foreground">
                          Rating
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {acceptanceRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Acceptance Rate
                        </div>
                        <Progress value={acceptanceRate} className="mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Payment Methods */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">USDC Wallet</div>
                        <div className="text-sm text-muted-foreground">
                          Auto-withdraw
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">
                          ${weeklyEarnings} / $1,000
                        </span>
                      </div>
                      <Progress value={(weeklyEarnings / 1000) * 100} />
                      <div className="text-sm text-muted-foreground">
                        ${1000 - weeklyEarnings} to reach goal
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bonuses */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Available Bonuses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="font-medium text-green-600">
                        Peak Hours
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +25% (6-9 PM)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="font-medium text-blue-600">
                        Weekend Bonus
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +15% all weekend
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Safety Features Tab */}
          <TabsContent value="safety" className="space-y-6 animate-fade-in-up">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <Shield className="mr-2 h-5 w-5" />
                  Driver Safety Features
                </CardTitle>
                <CardDescription>
                  Advanced safety systems to protect you and your passengers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Safety Score */}
                <div className="text-center p-6 rounded-lg glass">
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {safetyScore}
                  </div>
                  <div className="text-lg font-medium">Safety Score</div>
                  <div className="text-sm text-muted-foreground">
                    Excellent Driver
                  </div>
                  <Progress
                    value={safetyScore}
                    className="mt-4 max-w-xs mx-auto"
                  />
                </div>

                {/* Safety Features Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {safetyFeatures.map((feature) => (
                    <div
                      key={feature.name}
                      className="flex items-center justify-between p-4 rounded-lg border glass-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            feature.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <Badge
                        variant={
                          feature.status === "active" ? "default" : "secondary"
                        }
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Emergency Contacts */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Emergency Contacts</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="font-medium">Emergency Services</div>
                          <div className="text-sm text-muted-foreground">
                            911
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Call
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">RideChain Support</div>
                          <div className="text-sm text-muted-foreground">
                            24/7 Driver Support
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Safety Tips</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>
                        Always verify passenger identity before starting trip
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>
                        Keep doors locked until passenger verification
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>
                        Trust your instincts - cancel ride if uncomfortable
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Keep emergency contacts readily accessible</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Routes Tab */}
          <TabsContent value="routes" className="space-y-6 animate-fade-in-up">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <Navigation className="mr-2 h-5 w-5" />
                  Smart Route Suggestions
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations for optimal driving locations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Location */}
                <div className="p-4 rounded-lg border glass">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Current Location</div>
                        <div className="text-sm text-muted-foreground">
                          Downtown Business District
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-600">
                      High Demand
                    </Badge>
                  </div>
                </div>

                {/* Route Suggestions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Recommended Areas</h3>
                  {routeSuggestions.map((route, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border glass-hover cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{route.area}</div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              route.demand === "High"
                                ? "default"
                                : route.demand === "Medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {route.demand} Demand
                          </Badge>
                          {route.surge > 1.2 && (
                            <Badge
                              variant="destructive"
                              className="animate-pulse"
                            >
                              <Zap className="mr-1 h-3 w-3" />
                              {route.surge}x
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Route className="h-4 w-4" />
                          <span>{route.distance}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{route.eta}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        variant="outline"
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate Here
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Heat Map Toggle */}
                <div className="p-4 rounded-lg border glass">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Demand Heat Map</div>
                      <div className="text-sm text-muted-foreground">
                        View real-time demand across the city
                      </div>
                    </div>
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      View Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EV Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* EV Rewards Overview */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center text-gradient">
                    <Leaf className="mr-2 h-5 w-5" />
                    EV-Friendly Driving Rewards
                  </CardTitle>
                  <CardDescription>
                    Earn extra rewards for eco-friendly driving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* EV Status */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">EV Driver Status</div>
                        <div className="text-sm text-muted-foreground">
                          {isEVDriver ? "Active EV Driver" : "Register your EV"}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={isEVDriver}
                      onCheckedChange={setIsEVDriver}
                    />
                  </div>

                  {/* EV Points */}
                  <div className="text-center p-6 rounded-lg glass">
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      {evPoints}
                    </div>
                    <div className="text-lg font-medium">EV Points</div>
                    <div className="text-sm text-muted-foreground">
                      Redeem for cash or rewards
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center">
                      <TreePine className="mr-2 h-4 w-4 text-green-500" />
                      Environmental Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 rounded-lg border">
                        <div className="text-xl font-bold text-green-600">
                          47kg
                        </div>
                        <div className="text-muted-foreground">CO₂ Saved</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border">
                        <div className="text-xl font-bold text-blue-600">
                          23L
                        </div>
                        <div className="text-muted-foreground">Fuel Saved</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Challenges */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>EV Challenges</CardTitle>
                  <CardDescription>
                    Complete challenges to earn bonus points
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evRewards.map((reward, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {reward.action}
                        </span>
                        <Badge variant="outline">{reward.points} pts</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={(reward.progress / 10) * 100}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {reward.progress}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Rewards Store */}
              <Card className="glass lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Rewards Store
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border glass-hover cursor-pointer">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="font-medium">$10 USDC</div>
                        <div className="text-sm text-muted-foreground">
                          1,000 points
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border glass-hover cursor-pointer">
                      <div className="text-center">
                        <Fuel className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-medium">Free Charging</div>
                        <div className="text-sm text-muted-foreground">
                          750 points
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border glass-hover cursor-pointer">
                      <div className="text-center">
                        <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <div className="font-medium">Premium Badge</div>
                        <div className="text-sm text-muted-foreground">
                          500 points
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
