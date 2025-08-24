import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiInfo as Info,
  FiCheckCircle as CheckCircle,
  FiX as X,
} from "react-icons/fi";

interface BookingFlowDebugProps {
  isEnhancedTracking: boolean;
  hasRideData: boolean;
  currentTab: string;
  driverPhone: string;
}

export default function BookingFlowDebug({
  isEnhancedTracking,
  hasRideData,
  currentTab,
  driverPhone,
}: BookingFlowDebugProps) {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Info className="mr-2 h-4 w-4 text-blue-500" />
          Booking Flow Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Enhanced Tracking Active:</span>
          <Badge variant={isEnhancedTracking ? "default" : "secondary"}>
            {isEnhancedTracking ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> YES
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" /> NO
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Has Ride Data:</span>
          <Badge variant={hasRideData ? "default" : "secondary"}>
            {hasRideData ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> YES
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" /> NO
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Current Tab:</span>
          <Badge variant="outline">{currentTab}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Driver Phone:</span>
          <Badge variant="outline">{driverPhone}</Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
          <strong>✅ Expected Flow:</strong>
          <br />
          1. Book ride → Enhanced tracking activates
          <br />
          2. SMS sent to {driverPhone}
          <br />
          3. Wait for SMS response (5min timeout)
          <br />
          4. Show driver details when accepted
        </div>
      </CardContent>
    </Card>
  );
}
