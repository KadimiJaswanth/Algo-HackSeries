import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FiPhone as Phone,
  FiCheckCircle as CheckCircle,
  FiX as X,
  FiClock as Clock,
  FiSend as Send,
  FiRefreshCw as RefreshCw,
} from "react-icons/fi";
import { useSmsNotification } from "@/lib/sms-service";

export default function SmsNotificationTest() {
  const { sendNotification, pollStatus } = useSmsNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    rideId?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const [testData, setTestData] = useState({
    riderName: "Test Rider",
    pickupLocation: "Downtown Business District, Main St & 5th Ave",
    dropoffLocation: "International Airport, Terminal 2",
    estimatedFare: 0.0025,
  });

  const [driverResponseStatus, setDriverResponseStatus] = useState<'pending' | 'accepted' | 'ignored' | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  const handleSendTestNotification = async () => {
    setIsLoading(true);
    setTestResult(null);
    setDriverResponseStatus(null);

    try {
      console.log("Sending test SMS notification...");
      
      const result = await sendNotification(
        testData.riderName,
        testData.pickupLocation,
        testData.dropoffLocation,
        testData.estimatedFare
      );

      setTestResult(result);

      if (result.success && result.rideId) {
        // Start polling for driver response
        setIsPolling(true);
        setDriverResponseStatus('pending');

        pollStatus(result.rideId, (status) => {
          console.log("Driver response status:", status);
          setDriverResponseStatus(status);
          
          if (status === 'accepted' || status === 'ignored') {
            setIsPolling(false);
          }
        }).catch(error => {
          console.error("Error polling status:", error);
          setIsPolling(false);
        });
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckRideStatus = async () => {
    if (!testResult?.rideId) return;

    try {
      const response = await fetch(`/api/sms/ride-status/${testResult.rideId}`);
      const data = await response.json();

      if (data.success && data.ride) {
        setDriverResponseStatus(data.ride.status);
        console.log("Current ride status:", data.ride);
      }
    } catch (error) {
      console.error("Error checking ride status:", error);
    }
  };

  const handleSimulateDriverResponse = async (action: 'ACCEPT' | 'IGNORE' | 'INVALID') => {
    if (!testResult?.rideId) return;

    try {
      const message = action === 'INVALID'
        ? `HELLO ${testResult.rideId}`
        : `${action} ${testResult.rideId}`;

      setTestMessage(message);

      const response = await fetch('/api/sms/simulate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          rideId: testResult.rideId,
        }),
      });

      const result = await response.json();
      console.log("Simulation result:", result);

      // Refresh status after simulation
      setTimeout(() => {
        handleCheckRideStatus();
      }, 1000);

    } catch (error) {
      console.error("Error simulating driver response:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="mr-2 h-5 w-5 text-primary" />
          SMS Notification Test
        </CardTitle>
        <CardDescription>
          Test the real SMS notification system with driver number: +91 6301214658
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Data Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold">Test Ride Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="rider-name">Rider Name</Label>
              <Input
                id="rider-name"
                value={testData.riderName}
                onChange={(e) =>
                  setTestData(prev => ({ ...prev, riderName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input
                id="pickup"
                value={testData.pickupLocation}
                onChange={(e) =>
                  setTestData(prev => ({ ...prev, pickupLocation: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input
                id="dropoff"
                value={testData.dropoffLocation}
                onChange={(e) =>
                  setTestData(prev => ({ ...prev, dropoffLocation: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="fare">Estimated Fare (TOKENS)</Label>
              <Input
                id="fare"
                type="number"
                step="0.0001"
                value={testData.estimatedFare}
                onChange={(e) =>
                  setTestData(prev => ({ 
                    ...prev, 
                    estimatedFare: parseFloat(e.target.value) || 0 
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Test Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Send Test SMS</h3>
            <Badge variant="outline">Driver: +91 6301214658</Badge>
          </div>
          
          <Button
            onClick={handleSendTestNotification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending SMS...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Notification
              </>
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testResult && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold">Test Results</h3>
              
              <Card className={`border-2 ${
                testResult.success 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-red-500/50 bg-red-500/5'
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">
                        {testResult.success ? 'SMS Sent Successfully!' : 'SMS Failed to Send'}
                      </span>
                    </div>
                    
                    {testResult.rideId && (
                      <div className="text-sm">
                        <strong>Ride ID:</strong> {testResult.rideId}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <strong>Message:</strong> {testResult.message}
                    </div>
                    
                    {testResult.error && (
                      <div className="text-sm text-red-600">
                        <strong>Error:</strong> {testResult.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Driver Response Status */}
              {testResult.success && testResult.rideId && (
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Driver Response Status</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCheckRideStatus}
                        disabled={isPolling}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className={`h-4 w-4 rounded-full ${
                        driverResponseStatus === 'pending' 
                          ? 'bg-yellow-500 animate-pulse' 
                          : driverResponseStatus === 'accepted'
                          ? 'bg-green-500'
                          : driverResponseStatus === 'ignored'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`} />
                      <span className="font-medium">
                        {driverResponseStatus === 'pending' && (
                          <>
                            <Clock className="inline h-4 w-4 mr-1" />
                            Waiting for driver response...
                          </>
                        )}
                        {driverResponseStatus === 'accepted' && (
                          <>
                            <CheckCircle className="inline h-4 w-4 mr-1" />
                            Driver accepted the ride!
                          </>
                        )}
                        {driverResponseStatus === 'ignored' && (
                          <>
                            <X className="inline h-4 w-4 mr-1" />
                            Driver declined the ride
                          </>
                        )}
                        {!driverResponseStatus && 'No response yet'}
                      </span>
                    </div>
                    
                    {isPolling && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        📱 Continuously checking for SMS responses from driver...
                      </div>
                    )}

                    {driverResponseStatus === 'pending' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <strong>Instructions for Driver (6301214658):</strong>
                        <br />
                        Reply to the SMS with:
                        <br />
                        • <code>ACCEPT {testResult.rideId}</code> - to accept the ride
                        <br />
                        • <code>IGNORE {testResult.rideId}</code> - to decline the ride
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* SMS Message Preview */}
        <Separator />
        <div className="space-y-4">
          <h3 className="font-semibold">SMS Message Preview</h3>
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="font-mono text-sm bg-muted/50 p-3 rounded whitespace-pre-line">
{`🚗 NEW RIDE REQUEST!
Rider: ${testData.riderName}
From: ${testData.pickupLocation}
To: ${testData.dropoffLocation}
Fare: ${testData.estimatedFare.toFixed(4)} TOKENS
ETA to pickup: 5-8 mins

Reply:
ACCEPT [RIDE_ID] - to accept
IGNORE [RIDE_ID] - to decline

Request ID: [RIDE_ID]`}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
