import { RequestHandler } from "express";
import twilio from "twilio";

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Driver phone number (hardcoded as requested)
const DRIVER_PHONE = "+916301214658";

// In-memory storage for active ride requests (in production, use a database)
const activeRideRequests = new Map<string, {
  id: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedFare: number;
  timestamp: Date;
  status: "pending" | "accepted" | "ignored";
}>();

interface SendNotificationRequest {
  rideId: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedFare: number;
}

export const sendDriverNotification: RequestHandler = async (req, res) => {
  try {
    const {
      rideId,
      riderId,
      riderName,
      pickupLocation,
      dropoffLocation,
      estimatedFare,
    }: SendNotificationRequest = req.body;

    console.log("Sending SMS notification to driver:", DRIVER_PHONE);
    console.log("Ride details:", { rideId, riderName, pickupLocation, dropoffLocation, estimatedFare });

    // Store ride request
    activeRideRequests.set(rideId, {
      id: rideId,
      riderId,
      riderName,
      pickupLocation,
      dropoffLocation,
      estimatedFare,
      timestamp: new Date(),
      status: "pending",
    });

    // Compose SMS message
    const message = `🚗 NEW RIDE REQUEST!
Rider: ${riderName}
From: ${pickupLocation}
To: ${dropoffLocation}
Fare: ${estimatedFare.toFixed(4)} TOKENS
ETA to pickup: 5-8 mins

Reply:
ACCEPT ${rideId} - to accept
IGNORE ${rideId} - to decline

Request ID: ${rideId}`;

    // Check if Twilio is configured
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.log("Twilio not configured, simulating SMS:");
      console.log("To:", DRIVER_PHONE);
      console.log("Message:", message);
      
      // Simulate successful SMS for development
      res.json({
        success: true,
        message: "SMS sent successfully (simulated)",
        rideId,
        sid: "simulated_" + Date.now(),
      });
      return;
    }

    // Send actual SMS
    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: DRIVER_PHONE,
    });

    console.log("SMS sent successfully:", twilioMessage.sid);

    res.json({
      success: true,
      message: "SMS sent successfully",
      rideId,
      sid: twilioMessage.sid,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send SMS notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSmsWebhook: RequestHandler = async (req, res) => {
  try {
    const { Body, From } = req.body;
    const messageBody = Body?.toUpperCase().trim();
    const fromNumber = From;

    console.log("📱 SMS WEBHOOK RECEIVED:");
    console.log("- From:", fromNumber);
    console.log("- Body:", Body);
    console.log("- Expected Driver Phone:", DRIVER_PHONE);
    console.log("- Twilio Configured:", !!(accountSid && authToken && twilioPhoneNumber));

    // Verify it's from the driver's phone
    if (fromNumber !== DRIVER_PHONE) {
      console.log("⚠️ SMS from unknown number:", fromNumber, "Expected:", DRIVER_PHONE);
      res.status(200).send("OK");
      return;
    }

    // Parse the message
    const parts = messageBody.split(" ");
    const action = parts[0]; // ACCEPT or IGNORE
    const rideId = parts[1]; // ride ID

    if (!rideId || !activeRideRequests.has(rideId)) {
      console.log("Invalid ride ID or ride not found:", rideId);
      
      // Send error message to driver
      if (accountSid && authToken && twilioPhoneNumber) {
        await client.messages.create({
          body: "❌ Invalid ride ID or ride request not found. Please check the ride ID and try again.",
          from: twilioPhoneNumber,
          to: DRIVER_PHONE,
        });
      }
      
      res.status(200).send("OK");
      return;
    }

    const rideRequest = activeRideRequests.get(rideId)!;

    if (action === "ACCEPT") {
      // Update ride status
      rideRequest.status = "accepted";
      activeRideRequests.set(rideId, rideRequest);

      console.log("Driver accepted ride:", rideId);

      // Send confirmation to driver
      if (accountSid && authToken && twilioPhoneNumber) {
        await client.messages.create({
          body: `✅ Ride ${rideId} ACCEPTED!
Rider: ${rideRequest.riderName}
Navigate to: ${rideRequest.pickupLocation}
ETA: 5-8 minutes
Payment: ${rideRequest.estimatedFare.toFixed(4)} TOKENS

The rider has been notified. Drive safely! 🚗`,
          from: twilioPhoneNumber,
          to: DRIVER_PHONE,
        });
      }

      // Here you would typically:
      // 1. Update the database
      // 2. Notify the rider via websocket/real-time connection
      // 3. Send push notification to rider app
      console.log("Rider should be notified that ride was accepted");

    } else if (action === "IGNORE") {
      // Update ride status
      rideRequest.status = "ignored";
      activeRideRequests.set(rideId, rideRequest);

      console.log("Driver ignored ride:", rideId);

      // Send confirmation to driver
      if (accountSid && authToken && twilioPhoneNumber) {
        await client.messages.create({
          body: `❌ Ride ${rideId} declined.
The system will reassign this ride to another driver.`,
          from: twilioPhoneNumber,
          to: DRIVER_PHONE,
        });
      }

      // Here you would typically:
      // 1. Update the database
      // 2. Reassign ride to another driver
      // 3. Notify the rider if no drivers available
      console.log("Ride should be reassigned to another driver");
    } else {
      // Invalid command
      if (accountSid && authToken && twilioPhoneNumber) {
        await client.messages.create({
          body: `❓ Invalid command: "${messageBody}"
Please reply with:
ACCEPT ${rideId} - to accept ride
IGNORE ${rideId} - to decline ride`,
          from: twilioPhoneNumber,
          to: DRIVER_PHONE,
        });
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling SMS webhook:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process SMS webhook",
    });
  }
};

export const getRideStatus: RequestHandler = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId || !activeRideRequests.has(rideId)) {
      res.status(404).json({
        success: false,
        error: "Ride not found",
      });
      return;
    }

    const rideRequest = activeRideRequests.get(rideId)!;

    res.json({
      success: true,
      ride: rideRequest,
    });
  } catch (error) {
    console.error("Error getting ride status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get ride status",
    });
  }
};

// Cleanup old ride requests (runs every 30 minutes)
setInterval(() => {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  for (const [rideId, request] of activeRideRequests.entries()) {
    if (request.timestamp < thirtyMinutesAgo) {
      activeRideRequests.delete(rideId);
      console.log("Cleaned up old ride request:", rideId);
    }
  }
}, 30 * 60 * 1000);

export default {
  sendDriverNotification,
  handleSmsWebhook,
  getRideStatus,
};
