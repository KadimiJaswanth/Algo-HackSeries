import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Repeat, 
  Plus,
  Edit,
  Trash2,
  Bell,
  Car,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface ScheduledRide {
  id: string;
  pickup: string;
  destination: string;
  date: Date;
  time: string;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    days?: string[];
    endDate?: Date;
  };
  vehicleType: string;
  estimatedFare: number;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  reminderSet: boolean;
  notes?: string;
}

export default function ScheduledRides() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState("weekly");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([
    {
      id: "scheduled-1",
      pickup: "Home",
      destination: "Office Downtown",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "08:30",
      recurring: {
        frequency: "daily",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        endDate: new Date(Date.now() + 30 * 86400000) // 30 days
      },
      vehicleType: "Standard",
      estimatedFare: 25,
      status: "scheduled",
      reminderSet: true,
      notes: "Morning commute"
    },
    {
      id: "scheduled-2",
      pickup: "Airport Terminal 1",
      destination: "Hotel District",
      date: new Date(Date.now() + 3 * 86400000), // 3 days from now
      time: "14:15",
      vehicleType: "Luxury",
      estimatedFare: 45,
      status: "confirmed",
      reminderSet: true,
      notes: "Business trip pickup"
    }
  ]);

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  const vehicleTypes = [
    { value: "economy", label: "Economy", price: 15 },
    { value: "standard", label: "Standard", price: 25 },
    { value: "premium", label: "Premium", price: 35 },
    { value: "luxury", label: "Luxury", price: 50 },
    { value: "pool", label: "Pool", price: 12 }
  ];

  const scheduleRide = () => {
    if (!selectedDate || !selectedTime || !pickup || !destination || !vehicleType) {
      alert("Please fill in all required fields");
      return;
    }

    const newRide: ScheduledRide = {
      id: `scheduled-${Date.now()}`,
      pickup,
      destination,
      date: selectedDate,
      time: selectedTime,
      vehicleType,
      estimatedFare: vehicleTypes.find(v => v.value === vehicleType)?.price || 25,
      status: "scheduled",
      reminderSet: true,
      recurring: isRecurring ? {
        frequency: recurringFreq as "daily" | "weekly" | "monthly"
      } : undefined
    };

    setScheduledRides(prev => [...prev, newRide]);
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setPickup("");
    setDestination("");
    setVehicleType("");
    setIsRecurring(false);
    setShowForm(false);
  };

  const cancelRide = (id: string) => {
    setScheduledRides(prev =>
      prev.map(ride =>
        ride.id === id ? { ...ride, status: "cancelled" } : ride
      )
    );
  };

  const deleteRide = (id: string) => {
    setScheduledRides(prev => prev.filter(ride => ride.id !== id));
  };

  const getStatusColor = (status: ScheduledRide["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTimeUntilRide = (date: Date, time: string) => {
    const rideDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    rideDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const diffMs = rideDateTime.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `in ${diffHours}h`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `in ${diffDays}d`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Calendar className="mr-2 h-6 w-6" />
              Scheduled Rides
            </span>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule Ride
            </Button>
          </CardTitle>
          <p className="text-muted-foreground">
            Plan your rides in advance with smart scheduling
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <p className="text-sm font-medium">{scheduledRides.filter(r => r.status === 'scheduled').length} Upcoming</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Repeat className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <p className="text-sm font-medium">{scheduledRides.filter(r => r.recurring).length} Recurring</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Bell className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">Smart Reminders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule New Ride Form */}
      {showForm && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-gradient">Schedule New Ride</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pickup and Destination */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Pickup Location</label>
                <Input
                  placeholder="Enter pickup address"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="glass"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Destination</label>
                <Input
                  placeholder="Enter destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="glass"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal glass"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Vehicle Type</label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type.label}</span>
                        <span className="ml-2 text-muted-foreground">${type.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="recurring" className="text-sm font-medium">
                  Make this a recurring ride
                </label>
              </div>
              
              {isRecurring && (
                <Select value={recurringFreq} onValueChange={setRecurringFreq}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button onClick={scheduleRide} className="flex-1 glow">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Ride
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="glass-hover"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Rides */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-gradient">Upcoming Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledRides
              .filter(ride => ride.status !== "completed" && ride.status !== "cancelled")
              .map((ride) => (
              <div key={ride.id} className="glass p-4 rounded-lg border border-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(ride.status)}>
                        {ride.status}
                      </Badge>
                      {ride.recurring && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Repeat className="mr-1 h-3 w-3" />
                          {ride.recurring.frequency}
                        </Badge>
                      )}
                      {ride.reminderSet && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <Bell className="mr-1 h-3 w-3" />
                          Reminder
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-sm">{ride.pickup}</span>
                        <span className="text-muted-foreground">→</span>
                        <MapPin className="h-4 w-4 text-red-400" />
                        <span className="text-sm">{ride.destination}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(ride.date, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{ride.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Car className="h-3 w-3" />
                          <span>{ride.vehicleType}</span>
                        </div>
                      </div>
                      
                      {ride.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          {ride.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-primary">
                      ${ride.estimatedFare}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getTimeUntilRide(ride.date, ride.time)}
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0 glass-hover">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0 glass-hover hover:bg-red-500/10"
                        onClick={() => cancelRide(ride.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {scheduledRides.filter(r => r.status !== "completed" && r.status !== "cancelled").length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No upcoming rides scheduled</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="mt-2 glass-hover"
                >
                  Schedule Your First Ride
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
