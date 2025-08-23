import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users,
  Zap,
  CheckCircle,
  XCircle,
  MessageSquare,
  Target,
  BarChart3
} from "lucide-react";

interface NegotiationOffer {
  id: string;
  from: "rider" | "driver" | "ai";
  amount: number;
  reasoning: string;
  timestamp: Date;
  accepted?: boolean;
  confidence: number;
}

interface MarketData {
  basePrice: number;
  surgeMultiplier: number;
  demandLevel: "low" | "medium" | "high";
  competitorPrices: number[];
  weatherImpact: number;
  eventPremium: number;
}

interface AIFareNegotiationProps {
  basePrice: number;
  onFareAgreed?: (finalPrice: number) => void;
}

export default function AIFareNegotiation({ basePrice, onFareAgreed }: AIFareNegotiationProps) {
  const [currentOffer, setCurrentOffer] = useState(basePrice);
  const [negotiationHistory, setNegotiationHistory] = useState<NegotiationOffer[]>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [negotiationActive, setNegotiationActive] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState<number | null>(null);

  const marketData: MarketData = {
    basePrice: basePrice,
    surgeMultiplier: 1.2,
    demandLevel: "medium",
    competitorPrices: [basePrice * 0.95, basePrice * 1.1, basePrice * 0.88],
    weatherImpact: 0.1,
    eventPremium: 0.15
  };

  const aiPersonality = {
    name: "RideAI",
    avatar: "🤖",
    negotiationStyle: "data-driven",
    acceptanceRate: 78
  };

  // AI Response Generator
  const generateAIResponse = (userOffer: number) => {
    const priceDiff = ((userOffer - marketData.basePrice) / marketData.basePrice) * 100;
    let reasoning = "";
    let confidence = 0;
    let counterOffer = userOffer;

    if (priceDiff < -20) {
      reasoning = "Market analysis shows this price is below fair value considering current demand and operational costs.";
      confidence = 85;
      counterOffer = marketData.basePrice * 0.9;
    } else if (priceDiff < -10) {
      reasoning = "Your offer is considered, but current surge pricing and demand suggest a slight increase.";
      confidence = 70;
      counterOffer = marketData.basePrice * 0.95;
    } else if (priceDiff < 5) {
      reasoning = "This price aligns well with market conditions. I can accept this offer.";
      confidence = 95;
      counterOffer = userOffer;
    } else {
      reasoning = "Current market data suggests a lower price would be more appropriate.";
      confidence = 60;
      counterOffer = marketData.basePrice * 1.05;
    }

    return { counterOffer, reasoning, confidence };
  };

  const handleUserOffer = async (offer: number) => {
    const userOffer: NegotiationOffer = {
      id: `offer-${Date.now()}`,
      from: "rider",
      amount: offer,
      reasoning: "User submitted offer",
      timestamp: new Date(),
      confidence: 100
    };

    setNegotiationHistory(prev => [...prev, userOffer]);
    setAiAnalyzing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiResponse = generateAIResponse(offer);
    
    const aiOffer: NegotiationOffer = {
      id: `ai-${Date.now()}`,
      from: "ai",
      amount: aiResponse.counterOffer,
      reasoning: aiResponse.reasoning,
      timestamp: new Date(),
      confidence: aiResponse.confidence
    };

    setNegotiationHistory(prev => [...prev, aiOffer]);
    setCurrentOffer(aiResponse.counterOffer);
    setAiAnalyzing(false);

    // Auto-accept if close enough
    if (Math.abs(offer - aiResponse.counterOffer) / offer < 0.05) {
      acceptOffer(offer);
    }
  };

  const acceptOffer = (price: number) => {
    setAgreedPrice(price);
    setNegotiationActive(false);
    onFareAgreed?.(price);
  };

  const startNegotiation = () => {
    setNegotiationActive(true);
    const initialAIOffer: NegotiationOffer = {
      id: "initial-ai",
      from: "ai",
      amount: basePrice,
      reasoning: "Starting price based on current market conditions, demand, and distance.",
      timestamp: new Date(),
      confidence: 90
    };
    setNegotiationHistory([initialAIOffer]);
  };

  if (agreedPrice) {
    return (
      <Card className="glass glow border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center text-green-400">
            <CheckCircle className="mr-2 h-5 w-5" />
            Fare Agreed!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-400">
              ${agreedPrice.toFixed(2)}
            </div>
            <p className="text-muted-foreground">
              Successfully negotiated fare through AI mediation
            </p>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Negotiation Complete
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Negotiation Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Brain className="mr-2 h-6 w-6" />
              AI Fare Negotiation
            </span>
            {negotiationActive && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                Active
              </Badge>
            )}
          </CardTitle>
          <p className="text-muted-foreground">
            Let our AI negotiate the best fare for both you and the driver
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <Target className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <p className="text-sm font-medium">{aiPersonality.acceptanceRate}% Success</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <BarChart3 className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <p className="text-sm font-medium">Real-time Data</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Zap className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">Instant Response</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Base Price</span>
              <span className="font-medium">${marketData.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Surge Multiplier</span>
              <Badge className={`${marketData.surgeMultiplier > 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                {marketData.surgeMultiplier}x
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Demand Level</span>
              <Badge className={`${
                marketData.demandLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                marketData.demandLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {marketData.demandLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Competitor Range</span>
              <span className="font-medium">
                ${Math.min(...marketData.competitorPrices).toFixed(2)} - ${Math.max(...marketData.competitorPrices).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!negotiationActive ? (
        /* Start Negotiation */
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-gradient">Current Fare</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              ${basePrice.toFixed(2)}
            </div>
            <p className="text-muted-foreground">
              Standard pricing based on distance and current conditions
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => acceptOffer(basePrice)}
                className="glow"
              >
                Accept Price
              </Button>
              <Button 
                variant="outline" 
                onClick={startNegotiation}
                className="glass-hover"
              >
                <Brain className="mr-2 h-4 w-4" />
                Negotiate with AI
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Active Negotiation */
        <div className="space-y-4">
          {/* Negotiation Interface */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-gradient">Make Your Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  ${currentOffer.toFixed(2)}
                </div>
                <Slider
                  value={[currentOffer]}
                  onValueChange={([value]) => setCurrentOffer(value)}
                  max={basePrice * 1.5}
                  min={basePrice * 0.5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>${(basePrice * 0.5).toFixed(2)}</span>
                  <span>${(basePrice * 1.5).toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={() => handleUserOffer(currentOffer)}
                disabled={aiAnalyzing}
                className="w-full glow"
              >
                {aiAnalyzing ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  'Submit Offer'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Negotiation History */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-gradient">Negotiation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {negotiationHistory.map((offer) => (
                  <div 
                    key={offer.id}
                    className={`p-3 rounded-lg border ${
                      offer.from === 'ai' 
                        ? 'border-purple-500/30 bg-purple-500/10' 
                        : 'border-blue-500/30 bg-blue-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          {offer.from === 'ai' ? (
                            <AvatarFallback className="text-xs">🤖</AvatarFallback>
                          ) : (
                            <AvatarFallback className="text-xs">👤</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm font-medium">
                          {offer.from === 'ai' ? 'RideAI' : 'You'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">${offer.amount.toFixed(2)}</span>
                        <Badge className="text-xs">
                          {offer.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.reasoning}</p>
                    {offer.from === 'ai' && (
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          size="sm" 
                          onClick={() => acceptOffer(offer.amount)}
                          className="glow"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setCurrentOffer(offer.amount * 0.9)}
                        >
                          Counter
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {aiAnalyzing && (
                  <div className="flex items-center justify-center p-4">
                    <Brain className="h-6 w-6 animate-spin text-purple-400 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      AI is analyzing your offer and market conditions...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
