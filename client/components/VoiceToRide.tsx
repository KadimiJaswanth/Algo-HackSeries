import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mic,
  MicOff,
  Volume2,
  Brain,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  MessageSquare,
  Play,
  Square,
} from "lucide-react";

interface VoiceCommand {
  id: string;
  transcript: string;
  confidence: number;
  timestamp: Date;
  intent:
    | "book_ride"
    | "cancel_ride"
    | "get_status"
    | "change_destination"
    | "unknown";
  entities: {
    pickup?: string;
    destination?: string;
    time?: string;
    vehicleType?: string;
  };
}

interface VoiceResponse {
  text: string;
  action?: "show_booking" | "start_ride" | "show_status";
}

export default function VoiceToRide() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [currentResponse, setCurrentResponse] = useState<VoiceResponse | null>(
    null,
  );
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        setTranscript(result.transcript);
        setConfidence(result.confidence * 100 || 85);

        if (result.isFinal) {
          processVoiceCommand(result.transcript, result.confidence * 100 || 85);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    // Check for speech synthesis
    if ("speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Request microphone permission
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then(() => setPermissionGranted(true))
      .catch(() => setPermissionGranted(false));
  }, []);

  const processVoiceCommand = async (text: string, confidence: number) => {
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const command = analyzeVoiceCommand(text, confidence);
    setCommands((prev) => [command, ...prev.slice(0, 4)]); // Keep last 5 commands

    const response = generateResponse(command);
    setCurrentResponse(response);

    // Speak the response
    if (synthesisRef.current && response.text) {
      const utterance = new SpeechSynthesisUtterance(response.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current.speak(utterance);
    }

    setIsProcessing(false);
    setTranscript("");
  };

  const analyzeVoiceCommand = (
    text: string,
    confidence: number,
  ): VoiceCommand => {
    const lowerText = text.toLowerCase();
    let intent: VoiceCommand["intent"] = "unknown";
    const entities: VoiceCommand["entities"] = {};

    // Intent detection
    if (
      lowerText.includes("book") ||
      lowerText.includes("ride") ||
      lowerText.includes("go to")
    ) {
      intent = "book_ride";
    } else if (lowerText.includes("cancel")) {
      intent = "cancel_ride";
    } else if (lowerText.includes("status") || lowerText.includes("where")) {
      intent = "get_status";
    } else if (
      lowerText.includes("change") &&
      lowerText.includes("destination")
    ) {
      intent = "change_destination";
    }

    // Entity extraction (simplified)
    const locationWords = [
      "airport",
      "downtown",
      "mall",
      "home",
      "work",
      "office",
      "station",
    ];
    const timeWords = ["now", "asap", "morning", "evening", "tonight"];
    const vehicleWords = ["uber", "lyft", "taxi", "pool", "luxury"];

    locationWords.forEach((location) => {
      if (lowerText.includes(location)) {
        if (lowerText.indexOf("to") < lowerText.indexOf(location)) {
          entities.destination = location;
        } else {
          entities.pickup = location;
        }
      }
    });

    timeWords.forEach((time) => {
      if (lowerText.includes(time)) {
        entities.time = time;
      }
    });

    vehicleWords.forEach((vehicle) => {
      if (lowerText.includes(vehicle)) {
        entities.vehicleType = vehicle;
      }
    });

    return {
      id: `cmd-${Date.now()}`,
      transcript: text,
      confidence,
      timestamp: new Date(),
      intent,
      entities,
    };
  };

  const generateResponse = (command: VoiceCommand): VoiceResponse => {
    switch (command.intent) {
      case "book_ride":
        if (command.entities.destination) {
          return {
            text: `I'll book a ride to ${command.entities.destination}. Let me find available drivers nearby.`,
            action: "show_booking",
          };
        } else {
          return {
            text: "I'd be happy to book a ride for you. Where would you like to go?",
          };
        }

      case "get_status":
        return {
          text: "Your driver Alex is 3 minutes away in a white Tesla Model 3. License plate ECO-789.",
          action: "show_status",
        };

      case "cancel_ride":
        return {
          text: "I've cancelled your current ride request. You won't be charged any cancellation fees.",
        };

      case "change_destination":
        return {
          text: "I can help you change your destination. Where would you like to go instead?",
        };

      default:
        return {
          text: "I didn't quite understand that. You can say things like 'book a ride to the airport' or 'check my ride status'.",
        };
    }
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported && permissionGranted) {
      setIsListening(true);
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      synthesisRef.current.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Voice recognition is not supported in your browser. Please use Chrome,
          Safari, or Edge for the best experience.
        </AlertDescription>
      </Alert>
    );
  }

  if (!permissionGranted) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Microphone permission is required for voice commands. Please allow
          microphone access and refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Interface Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-gradient">
            <Volume2 className="mr-2 h-6 w-6" />
            Voice-to-Ride Assistant
          </CardTitle>
          <p className="text-muted-foreground">
            Say commands like "Book a ride to the airport" or "Check my ride
            status"
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <Brain className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">AI Powered</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-sm font-medium">Instant Response</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <MessageSquare className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <p className="text-sm font-medium">Natural Language</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Control Interface */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span>Voice Commands</span>
            {isListening && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                Listening
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {/* Microphone Button */}
            <div className="relative">
              <Button
                size="lg"
                className={`
                  w-24 h-24 rounded-full text-lg font-bold
                  ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-green-500 hover:bg-green-600"
                  }
                  transition-all duration-300 hover:scale-105 glow
                `}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Brain className="h-8 w-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>

              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>

            {/* Status Text */}
            <div className="min-h-[60px] flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Processing your command...
                  </p>
                  <Progress value={75} className="w-48 h-2 mt-2 mx-auto" />
                </div>
              ) : isListening ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-primary">
                    Listening...
                  </p>
                  {transcript && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        "{transcript}"
                      </p>
                      {confidence > 0 && (
                        <Badge className="mt-1 bg-primary/20 text-primary border-primary/30">
                          {confidence.toFixed(0)}% confidence
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tap the microphone and say your command
                </p>
              )}
            </div>

            {/* Quick Voice Commands */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText("Book a ride to downtown")}
                className="glass-hover"
              >
                <Play className="mr-2 h-3 w-3" />
                Try: "Book a ride"
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText("Check my ride status")}
                className="glass-hover"
              >
                <Play className="mr-2 h-3 w-3" />
                Try: "Check status"
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Response */}
      {currentResponse && (
        <Card className="glass border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-400">
              <Volume2 className="mr-2 h-5 w-5" />
              Assistant Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <MessageSquare className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{currentResponse.text}</p>
                {currentResponse.action && (
                  <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                    Action: {currentResponse.action.replace("_", " ")}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Command History */}
      {commands.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-gradient">Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {commands.map((command) => (
                <div
                  key={command.id}
                  className="glass p-3 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={`${
                        command.intent === "book_ride"
                          ? "bg-blue-500/20 text-blue-400"
                          : command.intent === "get_status"
                            ? "bg-green-500/20 text-green-400"
                            : command.intent === "cancel_ride"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {command.intent.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {command.confidence.toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-sm">"{command.transcript}"</p>
                  {Object.keys(command.entities).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(command.entities).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Commands Help */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">
            Voice Commands Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Booking Rides</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• "Book a ride to the airport"</li>
                <li>• "I need to go downtown"</li>
                <li>• "Take me home"</li>
                <li>• "Schedule a ride for tomorrow morning"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Ride Management</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• "Check my ride status"</li>
                <li>• "Where is my driver?"</li>
                <li>• "Cancel my ride"</li>
                <li>• "Change destination to the mall"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
