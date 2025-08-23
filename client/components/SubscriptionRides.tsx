import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  DollarSign, 
  Calendar, 
  Zap, 
  Car,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Gift,
  Infinity
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  ridesIncluded: number;
  features: string[];
  savings: number;
  popular: boolean;
}

interface ActiveSubscription {
  planId: string;
  ridesUsed: number;
  ridesRemaining: number;
  renewalDate: Date;
  totalSavings: number;
}

export default function SubscriptionRides() {
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription>({
    planId: "commuter-pro",
    ridesUsed: 18,
    ridesRemaining: 32,
    renewalDate: new Date(Date.now() + 12 * 86400000), // 12 days from now
    totalSavings: 245
  });

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic Commuter",
      icon: <Car className="h-6 w-6" />,
      price: 99,
      ridesIncluded: 20,
      features: [
        "20 rides per month",
        "Standard vehicles only",
        "10% additional savings",
        "Basic support"
      ],
      savings: 30,
      popular: false
    },
    {
      id: "commuter-pro",
      name: "Commuter Pro",
      icon: <Star className="h-6 w-6" />,
      price: 199,
      ridesIncluded: 50,
      features: [
        "50 rides per month",
        "Premium & Standard vehicles",
        "20% additional savings",
        "Priority booking",
        "24/7 support",
        "Scheduled rides included"
      ],
      savings: 80,
      popular: true
    },
    {
      id: "unlimited",
      name: "Unlimited Elite",
      icon: <Crown className="h-6 w-6" />,
      price: 399,
      ridesIncluded: -1, // Unlimited
      features: [
        "Unlimited rides",
        "All vehicle types including luxury",
        "30% additional savings",
        "VIP priority booking",
        "Concierge support",
        "Pool rides included",
        "Emergency rides priority"
      ],
      savings: 200,
      popular: false
    }
  ];

  const usagePercentage = (activeSubscription.ridesUsed / (activeSubscription.ridesUsed + activeSubscription.ridesRemaining)) * 100;

  return (
    <div className="space-y-6">
      {/* Subscription Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-gold-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-gradient">
            <Crown className="mr-2 h-6 w-6" />
            Subscription Rides
          </CardTitle>
          <p className="text-muted-foreground">
            Save money with monthly ride subscriptions
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <p className="text-sm font-medium">Up to 30% Savings</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-sm font-medium">Priority Booking</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Gift className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">Exclusive Perks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gradient">
            <span>Current Subscription</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-primary">
                {subscriptionPlans.find(p => p.id === activeSubscription.planId)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Renews on {activeSubscription.renewalDate.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${activeSubscription.totalSavings}
              </div>
              <p className="text-xs text-muted-foreground">Total saved</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Rides Used This Month</span>
              <span>{activeSubscription.ridesUsed} / {activeSubscription.ridesUsed + activeSubscription.ridesRemaining}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{activeSubscription.ridesRemaining} rides remaining</span>
              <span>{Math.round(usagePercentage)}% used</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="glass-hover">
              <Calendar className="mr-2 h-4 w-4" />
              View Usage
            </Button>
            <Button variant="outline" className="glass-hover">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6">
        <h3 className="text-lg font-semibold text-gradient">Available Plans</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`glass relative ${plan.popular ? 'border-primary/50 glow' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-accent/20'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${plan.price}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {plan.ridesIncluded === -1 ? (
                      <>
                        <Infinity className="h-5 w-5 text-accent" />
                        <span className="font-medium">Unlimited rides</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">{plan.ridesIncluded}</span>
                        <span className="text-sm text-muted-foreground">rides</span>
                      </>
                    )}
                  </div>
                  <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
                    Save ${plan.savings}/month
                  </Badge>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.id === activeSubscription.planId 
                      ? 'opacity-50 cursor-not-allowed' 
                      : plan.popular 
                      ? 'glow' 
                      : 'glass-hover'
                  }`}
                  disabled={plan.id === activeSubscription.planId}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.id === activeSubscription.planId ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Benefits */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">Subscription Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Guaranteed Savings</h4>
                  <p className="text-sm text-muted-foreground">
                    Save up to 30% compared to pay-per-ride
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Priority Booking</h4>
                  <p className="text-sm text-muted-foreground">
                    Skip the queue during peak hours
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Crown className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium">Premium Features</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to luxury vehicles and VIP support
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Gift className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-medium">Exclusive Perks</h4>
                  <p className="text-sm text-muted-foreground">
                    Special discounts and rewards for members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
