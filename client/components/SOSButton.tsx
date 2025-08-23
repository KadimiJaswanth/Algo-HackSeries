import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Shield, 
  Users, 
  Clock,
  Camera,
  Mic,
  Navigation,
  Zap
} from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface SOSButtonProps {
  isActive?: boolean;
  onEmergencyActivated?: () => void;
}

export default function SOSButton({ isActive = false, onEmergencyActivated }: SOSButtonProps) {
  const [emergencyActive, setEmergencyActive] = useState(isActive);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { name: "Emergency Services", phone: "911", relationship: "Emergency" },
    { name: "John Doe", phone: "+1 (555) 123-4567", relationship: "Emergency Contact" },
    { name: "Jane Smith", phone: "+1 (555) 987-6543", relationship: "Family" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountingDown(false);
            activateEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountingDown, countdown]);

  const startEmergencyCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
  };

  const cancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(0);
  };

  const activateEmergency = () => {
    setEmergencyActive(true);
    onEmergencyActivated?.();
    
    // Simulate emergency actions
    console.log("🚨 EMERGENCY ACTIVATED:");
    console.log("- Sending location to emergency contacts");
    console.log("- Starting audio/video recording");
    console.log("- Notifying ride platform");
    console.log("- Contacting emergency services");
  };

  const deactivateEmergency = () => {
    setEmergencyActive(false);
    setIsCountingDown(false);
    setCountdown(0);
  };

  if (emergencyActive) {
    return (
      <div className="space-y-4">
        {/* Emergency Active State */}
        <Alert className="border-red-500 bg-red-500/10 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500 font-medium">
            EMERGENCY ACTIVATED - Help is on the way
          </AlertDescription>
        </Alert>

        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-500">
              <Shield className="mr-2 h-5 w-5" />
              Emergency Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Camera className="h-4 w-4" />
                <span>Recording Video</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Mic className="h-4 w-4" />
                <span>Recording Audio</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <MapPin className="h-4 w-4" />
                <span>Sharing Location</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Users className="h-4 w-4" />
                <span>Contacts Notified</span>
              </div>
            </div>

            {/* Emergency Contacts Status */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Emergency Contacts Notified:</h4>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded">
                  <span>{contact.name}</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Notified
                  </Badge>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-green-500/30 hover:bg-green-500/10"
                onClick={() => window.open('tel:911')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 911
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={deactivateEmergency}
              >
                I'm Safe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Countdown State */}
      {isCountingDown && (
        <Alert className="border-orange-500 bg-orange-500/10">
          <Clock className="h-4 w-4 text-orange-500" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-500 font-medium">
              Emergency activating in {countdown}s
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={cancelCountdown}
              className="border-orange-500/30 hover:bg-orange-500/10"
            >
              Cancel
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SOS Button */}
      <div className="text-center">
        <Button
          size="lg"
          variant="destructive"
          className={`
            w-32 h-32 rounded-full text-lg font-bold
            ${isCountingDown 
              ? 'animate-pulse bg-orange-500 hover:bg-orange-600' 
              : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-red-500/25'
            }
            transition-all duration-300 hover:scale-105
          `}
          onClick={isCountingDown ? cancelCountdown : startEmergencyCountdown}
          disabled={emergencyActive}
        >
          {isCountingDown ? (
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
              <div>{countdown}</div>
            </div>
          ) : (
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
              <div>SOS</div>
            </div>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Press and hold for emergency
        </p>
      </div>

      {/* Safety Features */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-gradient">
            <Shield className="mr-2 h-5 w-5" />
            Safety Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-blue-500/20">
                <MapPin className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-sm">Live Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-green-500/20">
                <Camera className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm">Auto Recording</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-purple-500/20">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-sm">Contact Alert</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-orange-500/20">
                <Zap className="h-4 w-4 text-orange-400" />
              </div>
              <span className="text-sm">Instant Response</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {emergencyContacts.slice(0, 2).map((contact, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.relationship}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(`tel:${contact.phone}`)}
                className="glass-hover"
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2">
            Manage Contacts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
