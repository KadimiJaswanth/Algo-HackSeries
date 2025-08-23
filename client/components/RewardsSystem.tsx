import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Star, 
  Trophy, 
  Coins, 
  Zap, 
  Target,
  Crown,
  Award,
  TrendingUp
} from "lucide-react";

interface RewardTier {
  name: string;
  icon: React.ReactNode;
  pointsRequired: number;
  benefits: string[];
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

export default function RewardsSystem() {
  const [currentPoints, setCurrentPoints] = useState(2450);
  const [lifetimePoints, setLifetimePoints] = useState(8900);
  
  const tiers: RewardTier[] = [
    {
      name: "Bronze Rider",
      icon: <Award className="h-5 w-5" />,
      pointsRequired: 0,
      benefits: ["5% cashback on rides", "Priority support"],
      color: "text-amber-600"
    },
    {
      name: "Silver Rider", 
      icon: <Star className="h-5 w-5" />,
      pointsRequired: 1000,
      benefits: ["10% cashback", "Skip ride queue", "Free ride insurance"],
      color: "text-gray-400"
    },
    {
      name: "Gold Rider",
      icon: <Trophy className="h-5 w-5" />,
      pointsRequired: 5000,
      benefits: ["15% cashback", "Premium vehicles", "Personal concierge"],
      color: "text-yellow-500"
    },
    {
      name: "Platinum Elite",
      icon: <Crown className="h-5 w-5" />,
      pointsRequired: 10000,
      benefits: ["20% cashback", "Luxury fleet access", "VIP treatment"],
      color: "text-purple-500"
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first-ride",
      title: "Welcome Aboard!",
      description: "Complete your first ride",
      points: 100,
      icon: <Zap className="h-5 w-5" />,
      completed: true
    },
    {
      id: "eco-warrior",
      title: "Eco Warrior",
      description: "Take 10 EV rides",
      points: 500,
      icon: <Target className="h-5 w-5" />,
      completed: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: "social-rider",
      title: "Social Rider",
      description: "Share 5 rides with friends",
      points: 300,
      icon: <Gift className="h-5 w-5" />,
      completed: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Book 20 scheduled rides",
      points: 400,
      icon: <TrendingUp className="h-5 w-5" />,
      completed: true
    }
  ];

  const getCurrentTier = () => {
    return tiers.reverse().find(tier => lifetimePoints >= tier.pointsRequired) || tiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers.findIndex(tier => tier.name === currentTier.name);
    return currentIndex > 0 ? tiers[currentIndex - 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Coins className="mr-2 h-6 w-6" />
              RidePoints Balance
            </span>
            <span className="text-2xl font-bold">{currentPoints.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Available Points</p>
              <p className="text-xl font-bold text-primary">{currentPoints.toLocaleString()}</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Lifetime Earned</p>
              <p className="text-xl font-bold text-accent">{lifetimePoints.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Tier */}
      <Card className="glass glow-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center text-gradient">
              <span className={currentTier.color}>{currentTier.icon}</span>
              <span className="ml-2">{currentTier.name}</span>
            </span>
            <Badge className="glass bg-primary/20 text-primary border-primary/30">
              Current Tier
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gradient">Benefits</h4>
              <ul className="space-y-1">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <Star className="mr-2 h-3 w-3 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextTier.name}</span>
                  <span>{lifetimePoints} / {nextTier.pointsRequired}</span>
                </div>
                <Progress 
                  value={(lifetimePoints / nextTier.pointsRequired) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {nextTier.pointsRequired - lifetimePoints} points to next tier
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`glass-hover p-4 rounded-lg border transition-all duration-300 ${
                  achievement.completed 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.completed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.progress !== undefined && (
                        <div className="mt-2">
                          <Progress 
                            value={(achievement.progress / (achievement.maxProgress || 1)) * 100}
                            className="h-1 w-32"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.progress} / {achievement.maxProgress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${
                      achievement.completed 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-primary/20 text-primary border-primary/30'
                    }`}>
                      +{achievement.points}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redeem Points */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">Redeem Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-hover p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Free Ride</h4>
                <Badge className="bg-primary/20 text-primary border-primary/30">1000 pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get a free ride up to $25 value
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={currentPoints < 1000}
              >
                Redeem
              </Button>
            </div>
            
            <div className="glass-hover p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">50% Discount</h4>
                <Badge className="bg-accent/20 text-accent border-accent/30">500 pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get 50% off your next ride
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={currentPoints < 500}
              >
                Redeem
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
