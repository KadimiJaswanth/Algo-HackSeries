import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TestTube, Phone, MessageSquare } from "lucide-react";
import SmsNotificationTest from "@/components/SmsNotificationTest";
import SmsConfirmationDemo from "@/components/SmsConfirmationDemo";

export default function SmsTest() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white glow">
                <TestTube className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gradient">SMS Test</span>
              <Badge variant="secondary">Testing Environment</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Introduction */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center text-gradient">
                <Phone className="mr-2 h-5 w-5" />
                Real SMS Notification Testing
              </CardTitle>
              <CardDescription>
                Test the complete SMS notification flow with the actual driver phone number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    How it works:
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Real SMS is sent to driver: <strong>+91 6301214658</strong></li>
                    <li>• Driver receives ride details via SMS</li>
                    <li>• Driver can reply with ACCEPT or IGNORE</li>
                    <li>• System tracks responses in real-time</li>
                    <li>• Rider gets immediate feedback</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Driver Instructions:</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>To accept a ride, reply:</p>
                    <code className="bg-green-100 px-2 py-1 rounded text-green-800">
                      ACCEPT [RIDE_ID]
                    </code>
                    <p>To decline a ride, reply:</p>
                    <code className="bg-red-100 px-2 py-1 rounded text-red-800">
                      IGNORE [RIDE_ID]
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Confirmation Flow Demo */}
          <SmsConfirmationDemo />

          {/* Advanced SMS Test Component */}
          <SmsNotificationTest />

          {/* API Information */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Backend endpoints handling the SMS notification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <code>POST /api/sms/send-notification</code>
                  <Badge variant="outline">Send SMS to driver</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <code>POST /api/sms/webhook</code>
                  <Badge variant="outline">Handle SMS responses</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <code>GET /api/sms/ride-status/:rideId</code>
                  <Badge variant="outline">Check ride status</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Status */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Environment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Twilio SMS Service:</span>
                  <Badge variant={process.env.NODE_ENV === 'development' ? 'secondary' : 'default'}>
                    {process.env.NODE_ENV === 'development' ? 'Simulated' : 'Production'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Driver Phone:</span>
                  <Badge variant="outline">+91 6301214658</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Real-time Polling:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SMS Webhook:</span>
                  <Badge variant="default">Configured</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
