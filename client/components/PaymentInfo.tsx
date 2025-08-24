import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FiInfo as Info,
  FiDollarSign as DollarSign,
  FiShield as Shield,
  FiTrendingUp as TrendingUp,
  FiLock as Lock,
} from "react-icons/fi";
import { FaWallet as Wallet } from "react-icons/fa";

export default function PaymentInfo() {
  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-gradient">
          <Wallet className="mr-2 h-5 w-5 text-primary" />
          Token Payment System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Range */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment Range:</strong> All ride fares are limited to{" "}
            <Badge className="mx-1 bg-primary/20 text-primary">
              0.0001 - 0.0009 TOKENS
            </Badge>
            to ensure affordable rides for everyone.
          </AlertDescription>
        </Alert>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-3 rounded-lg text-center">
            <Lock className="h-5 w-5 mx-auto mb-2 text-blue-400" />
            <p className="text-xs font-medium">Wallet Only</p>
            <p className="text-xs text-muted-foreground">
              Tokens deducted directly
            </p>
          </div>
          <div className="glass p-3 rounded-lg text-center">
            <Shield className="h-5 w-5 mx-auto mb-2 text-green-400" />
            <p className="text-xs font-medium">Secure</p>
            <p className="text-xs text-muted-foreground">Instant validation</p>
          </div>
        </div>

        {/* Vehicle Type Pricing */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gradient">Vehicle Pricing</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">🚴 Bike:</span>
              <span className="font-medium">0.0001-0.0003 TOKENS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">🛺 Auto:</span>
              <span className="font-medium">0.0002-0.0004 TOKENS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">🚗 Car:</span>
              <span className="font-medium">0.0003-0.0007 TOKENS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">✨ Premium:</span>
              <span className="font-medium">0.0005-0.0009 TOKENS</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gradient">Benefits</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span>Fair pricing for all ride types</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-3 w-3 text-blue-400" />
              <span>No hidden fees or charges</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 text-purple-400" />
              <span>Instant wallet-to-wallet transfers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
