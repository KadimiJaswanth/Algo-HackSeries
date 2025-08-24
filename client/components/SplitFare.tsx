import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  DollarSign,
  Plus,
  Minus,
  Send,
  CheckCircle,
  Clock,
  User,
  Wallet,
  Share,
  Calculator,
  CreditCard,
  Link,
  Copy,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  amount: number;
  paymentStatus: "pending" | "paid" | "declined";
  paymentMethod?: string;
  walletAddress?: string;
}

interface SplitFareProps {
  totalFare: number;
  rideId: string;
}

export default function SplitFare({ totalFare, rideId }: SplitFareProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "self",
      name: "You",
      amount: totalFare,
      paymentStatus: "pending",
      paymentMethod: "Avalanche Wallet",
    },
  ]);

  const [newParticipant, setNewParticipant] = useState("");
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");
  const [shareLink, setShareLink] = useState("");
  const [linkGenerated, setLinkGenerated] = useState(false);

  const addParticipant = () => {
    if (newParticipant.trim()) {
      const newId = `participant-${Date.now()}`;
      const newPerson: Participant = {
        id: newId,
        name: newParticipant.trim(),
        amount: 0,
        paymentStatus: "pending",
      };

      setParticipants((prev) => [...prev, newPerson]);
      setNewParticipant("");

      // Recalculate split
      if (splitMethod === "equal") {
        calculateEqualSplit([...participants, newPerson]);
      }
    }
  };

  const removeParticipant = (id: string) => {
    if (id === "self") return; // Can't remove yourself

    const updatedParticipants = participants.filter((p) => p.id !== id);
    setParticipants(updatedParticipants);

    if (splitMethod === "equal") {
      calculateEqualSplit(updatedParticipants);
    }
  };

  const calculateEqualSplit = (currentParticipants: Participant[]) => {
    const splitAmount = totalFare / currentParticipants.length;
    const updated = currentParticipants.map((p) => ({
      ...p,
      amount: Math.round(splitAmount * 100) / 100,
    }));
    setParticipants(updated);
  };

  const updateAmount = (id: string, amount: number) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, amount: Math.max(0, amount) } : p,
      ),
    );
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}/split/${rideId}?total=${totalFare}`;
    setShareLink(link);
    setLinkGenerated(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const sendInvitation = (participant: Participant) => {
    // In a real app, this would send an invitation via email/SMS
    console.log(
      `Sending invitation to ${participant.name} for ${participant.amount.toFixed(6)} AVAX`,
    );
  };

  const totalSplit = participants.reduce((sum, p) => sum + p.amount, 0);
  const difference = Math.round((totalSplit - totalFare) * 100) / 100;
  const isBalanced = Math.abs(difference) < 0.01;

  const paidAmount = participants
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const paymentProgress = (paidAmount / totalFare) * 100;

  return (
    <div className="space-y-4">
      {/* Split Fare Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Split Fare
            </span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {totalFare.toFixed(6)} AVAX Total
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Share ride costs with friends using Avalanche Fuji tokens
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <p className="text-sm font-medium">
                {participants.length} People
              </p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <p className="text-sm font-medium">
                {(totalFare / participants.length).toFixed(6)} AVAX Each
              </p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Wallet className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">AVAX Payments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Progress */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span>Payment Progress</span>
            <span className="text-sm text-muted-foreground">
              {paidAmount.toFixed(6)} / {totalFare.toFixed(6)} AVAX
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={paymentProgress} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(paymentProgress)}% Complete</span>
            <span>{(totalFare - paidAmount).toFixed(6)} AVAX Remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Split Method Selection */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Split Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={splitMethod === "equal" ? "default" : "outline"}
              onClick={() => {
                setSplitMethod("equal");
                calculateEqualSplit(participants);
              }}
              className="glass-hover"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Equal Split
            </Button>
            <Button
              variant={splitMethod === "custom" ? "default" : "outline"}
              onClick={() => setSplitMethod("custom")}
              className="glass-hover"
            >
              <User className="mr-2 h-4 w-4" />
              Custom Amounts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Participants */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Add Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter name, email, or wallet address"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addParticipant()}
              className="glass"
            />
            <Button onClick={addParticipant} className="glow">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 glass rounded-lg border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="border-2 border-primary/30">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{participant.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs ${
                          participant.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : participant.paymentStatus === "declined"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {participant.paymentStatus}
                      </Badge>
                      {participant.paymentMethod && (
                        <span className="text-xs text-muted-foreground">
                          {participant.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {splitMethod === "custom" ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAmount(participant.id, participant.amount - 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium min-w-[60px] text-center">
                        {participant.amount.toFixed(6)} AVAX
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAmount(participant.id, participant.amount + 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium text-primary">
                      {participant.amount.toFixed(6)} AVAX
                    </span>
                  )}

                  <div className="flex space-x-1">
                    {participant.id !== "self" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendInvitation(participant)}
                          className="h-8 w-8 p-0 glass-hover"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeParticipant(participant.id)}
                          className="h-8 w-8 p-0 glass-hover hover:bg-red-500/10"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Balance Check */}
          {!isBalanced && (
            <Alert className="mt-4">
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                {difference > 0
                ? `Split total is ${difference.toFixed(6)} AVAX over the ride fare`
                : `Split total is ${Math.abs(difference).toFixed(6)} AVAX under the ride fare`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Share Link */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Share Payment Link</CardTitle>
        </CardHeader>
        <CardContent>
          {!linkGenerated ? (
            <Button onClick={generateShareLink} className="w-full glow">
              <Share className="mr-2 h-4 w-4" />
              Generate Share Link
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="glass font-mono text-sm"
                />
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="glass-hover"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with friends to let them join and pay their
                share
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Ride Fare</span>
              <span className="font-medium">{totalFare.toFixed(6)} AVAX</span>
            </div>
            <div className="flex justify-between">
              <span>Your Share</span>
              <span className="font-medium text-primary">
                {participants.find((p) => p.id === "self")?.amount.toFixed(6)} AVAX
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Wallet className="mr-1 h-3 w-3" />
                Avalanche Wallet
              </Badge>
            </div>
            <div className="pt-2 border-t border-border/50">
              <Button
                className="w-full glow"
                disabled={!isBalanced}
                onClick={() => console.log("Processing payment...")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Your Share (
                {participants.find((p) => p.id === "self")?.amount.toFixed(6)} AVAX)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
