import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FiArrowLeft as ArrowLeft,
  FiSend as Send,
  FiPhone as Phone,
  FiMoreVertical as MoreVertical,
  FiMapPin as MapPin,
  FiStar as Star,
  FiUser as User,
} from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: "user" | "driver";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface DriverInfo {
  name: string;
  avatar?: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
  isOnline: boolean;
  eta: string;
}

export default function DriverChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get driver info from URL params
    const driverName = searchParams.get("driverName") || "Alex Johnson";
    const driverRating = searchParams.get("driverRating") || "4.8";
    const vehicle = searchParams.get("vehicle") || "Toyota Camry";
    const licensePlate = searchParams.get("licensePlate") || "ABC-123";

    setDriverInfo({
      name: driverName,
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${driverName}`,
      rating: parseFloat(driverRating),
      vehicle,
      licensePlate,
      isOnline: true,
      eta: "5 min",
    });

    // Load initial messages
    const initialMessages: Message[] = [
      {
        id: "1",
        text: "Hello! I'm your driver for today. I'm on my way to pick you up.",
        sender: "driver",
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        status: "read",
      },
      {
        id: "2",
        text: "Great! How long until you arrive?",
        sender: "user",
        timestamp: new Date(Date.now() - 90000), // 1.5 minutes ago
        status: "read",
      },
      {
        id: "3",
        text: "I'll be there in about 5 minutes. I'm driving a white Toyota Camry.",
        sender: "driver",
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        status: "read",
      },
    ];

    setMessages(initialMessages);
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: new Date(),
        status: "sent",
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");

      // Simulate driver response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const driverResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: getRandomDriverResponse(),
            sender: "driver",
            timestamp: new Date(),
            status: "sent",
          };
          setMessages(prev => [...prev, driverResponse]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const getRandomDriverResponse = () => {
    const responses = [
      "Thanks for letting me know!",
      "I can see you on the map. Almost there!",
      "No problem, I'll be right there.",
      "Sure thing! See you soon.",
      "Copy that. On my way!",
      "I'm just around the corner now.",
      "Perfect timing, I just arrived at your pickup location.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleCall = () => {
    alert(`Calling driver: 6301214658`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!driverInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-glass-border">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="glass-hover"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src={driverInfo.avatar} alt={driverInfo.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                {driverInfo.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold">{driverInfo.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{driverInfo.rating}</span>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  <span>ETA {driverInfo.eta}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="glass-hover border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="glass-hover">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Trip Info Banner */}
      <div className="px-4 py-3 bg-primary/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              On the way
            </Badge>
            <span className="text-sm text-muted-foreground">
              {driverInfo.vehicle} • {driverInfo.licensePlate}
            </span>
          </div>
          <div className="text-sm font-medium text-primary">
            ETA: {driverInfo.eta}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className={`text-xs ${
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === "user" && message.status && (
                  <div className={`text-xs ${
                    message.status === "read" ? "text-blue-400" : "text-primary-foreground/70"
                  }`}>
                    {message.status === "read" ? "✓✓" : "✓"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-12 bg-muted/50 border-muted"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setNewMessage("I'm here!")}
          >
            I'm here!
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setNewMessage("Running 2 minutes late")}
          >
            Running late
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setNewMessage("Where are you?")}
          >
            Where are you?
          </Button>
        </div>
      </div>
    </div>
  );
}
