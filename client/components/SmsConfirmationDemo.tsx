import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FiPhone as Phone,
  FiSend as Send,
  FiCheckCircle as CheckCircle,
  FiX as X,
  FiMessageSquare as MessageSquare,
  FiArrowRight as ArrowRight,
} from "react-icons/fi";

export default function SmsConfirmationDemo() {
  const [step, setStep] = useState(1);
  const [testRideId, setTestRideId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoData = {
    riderName: "Demo Rider",
    pickupLocation: "Downtown Plaza, Main Street",
    dropoffLocation: "City Airport, Terminal 1",
    estimatedFare: 0.0035,
  };

  const handleSendTestRide = async () => {
    setIsLoading(true);
    setStep(2);

    try {
      const response = await fetch('/api/sms/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rideId: `demo-${Date.now()}`,
          riderId: 'demo-rider',
          riderName: demoData.riderName,
          pickupLocation: demoData.pickupLocation,
          dropoffLocation: demoData.dropoffLocation,
          estimatedFare: demoData.estimatedFare,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setTestRideId(result.rideId);
        setStep(3);
      }
    } catch (error) {
      console.error("Error sending test ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateResponse = async (action: 'ACCEPT' | 'IGNORE') => {
    if (!testRideId) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sms/simulate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `${action} ${testRideId}`,
          rideId: testRideId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStep(action === 'ACCEPT' ? 4 : 5);
      }
    } catch (error) {
      console.error("Error simulating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemo = () => {
    setStep(1);
    setTestRideId(null);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          SMS Confirmation Flow Demo
        </CardTitle>
        <CardDescription>
          Complete demonstration of the driver SMS confirmation system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          {[
            { num: 1, label: "Send Request", active: step >= 1 },
            { num: 2, label: "Driver Receives SMS", active: step >= 2 },
            { num: 3, label: "Driver Responds", active: step >= 3 },
            { num: 4, label: "Confirmation Sent", active: step >= 4 },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s.active
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.num}
              </div>
              <span className={`ml-2 text-sm ${s.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {index < 3 && (
                <ArrowRight className={`mx-3 h-4 w-4 ${s.active ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Send Request */}
        {step === 1 && (
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Send className="mr-2 h-5 w-5 text-blue-500" />
                Step 1: Send Ride Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Rider:</strong> {demoData.riderName}
                </div>
                <div>
                  <strong>Fare:</strong> {demoData.estimatedFare.toFixed(4)} TOKENS
                </div>
                <div className="col-span-2">
                  <strong>From:</strong> {demoData.pickupLocation}
                </div>
                <div className="col-span-2">
                  <strong>To:</strong> {demoData.dropoffLocation}
                </div>
              </div>
              <Button
                onClick={handleSendTestRide}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending SMS to Driver...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Send SMS to Driver (6301214658)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: SMS Sent */}
        {step === 2 && (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Phone className="mr-2 h-5 w-5 text-yellow-500" />
                Step 2: SMS Sent to Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-yellow-500 text-white">
                  SMS Delivered to +91 6301214658
                </Badge>
                <div className="p-3 bg-muted/50 rounded border font-mono text-sm">
                  🚗 NEW RIDE REQUEST!<br />
                  Rider: {demoData.riderName}<br />
                  From: {demoData.pickupLocation}<br />
                  To: {demoData.dropoffLocation}<br />
                  Fare: {demoData.estimatedFare.toFixed(4)} TOKENS<br />
                  ETA to pickup: 5-8 mins<br />
                  <br />
                  Reply:<br />
                  ACCEPT [RIDE_ID] - to accept<br />
                  IGNORE [RIDE_ID] - to decline<br />
                  <br />
                  Request ID: {testRideId}
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Waiting for driver response...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Driver Response Options */}
        {step === 3 && (
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                Step 3: Driver Response
              </CardTitle>
              <CardDescription>
                Driver can now respond to the SMS. Simulate different responses:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleSimulateResponse('ACCEPT')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Simulate "ACCEPT"
                </Button>
                <Button
                  onClick={() => handleSimulateResponse('IGNORE')}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Simulate "IGNORE"
                </Button>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                In real usage, driver would reply via SMS: <code>ACCEPT {testRideId}</code> or <code>IGNORE {testRideId}</code>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Accept Confirmation */}
        {step === 4 && (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                Step 4: Acceptance Confirmation Sent!
              </CardTitle>
              <CardDescription>
                Driver received detailed confirmation SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className="bg-green-500 text-white">
                ✅ Confirmation SMS Sent to Driver
              </Badge>
              <div className="p-3 bg-muted/50 rounded border font-mono text-sm">
                ✅ RIDE ACCEPTED! - {testRideId}<br />
                <br />
                📍 Pickup: {demoData.pickupLocation}<br />
                📍 Dropoff: {demoData.dropoffLocation}<br />
                👤 Rider: {demoData.riderName}<br />
                💰 Fare: {demoData.estimatedFare.toFixed(4)} TOKENS<br />
                ⏰ ETA to pickup: 5-8 minutes<br />
                <br />
                🎯 Next Steps:<br />
                1. Navigate to pickup location<br />
                2. Call rider if needed<br />
                3. Start ride when rider is picked up<br />
                <br />
                The rider has been notified and is waiting for you. Drive safely! 🚗
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>✅ Success!</strong> The driver now has all the details needed to complete the ride,
                  and the rider has been notified that their ride was accepted.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Ignore Confirmation */}
        {step === 5 && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-red-600">
                <X className="mr-2 h-5 w-5" />
                Step 4: Decline Confirmation Sent
              </CardTitle>
              <CardDescription>
                Driver received decline confirmation SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className="bg-red-500 text-white">
                ❌ Decline Confirmation SMS Sent to Driver
              </Badge>
              <div className="p-3 bg-muted/50 rounded border font-mono text-sm">
                ❌ RIDE DECLINED - {testRideId}<br />
                <br />
                You have declined the ride request from {demoData.riderName}.<br />
                <br />
                📍 From: {demoData.pickupLocation}<br />
                📍 To: {demoData.dropoffLocation}<br />
                💰 Fare: {demoData.estimatedFare.toFixed(4)} TOKENS<br />
                <br />
                🔄 The system will now:<br />
                - Notify the rider<br />
                - Look for another available driver<br />
                - You may receive new ride requests<br />
                <br />
                Thank you for your response! 🚗
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-800">
                  <strong>ℹ️ Info:</strong> The driver has been confirmed of their decline, 
                  and the system will now look for another available driver for the rider.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reset Button */}
        {step > 3 && (
          <div className="flex justify-center pt-4">
            <Button onClick={resetDemo} variant="outline">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Run Demo Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
