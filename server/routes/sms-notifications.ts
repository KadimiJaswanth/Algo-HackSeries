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

      console.log("✅ Driver accepted ride:", rideId);

      const confirmationMessage = `✅ RIDE ACCEPTED! - ${rideId}

📍 Pickup: ${rideRequest.pickupLocation}
📍 Dropoff: ${rideRequest.dropoffLocation}
👤 Rider: ${rideRequest.riderName}
💰 Fare: ${rideRequest.estimatedFare.toFixed(4)} TOKENS
⏰ ETA to pickup: 5-8 minutes

🎯 Next Steps:
1. Navigate to pickup location
2. Call rider if needed
3. Start ride when rider is picked up

The rider has been notified and is waiting for you. Drive safely! 🚗`;

      // Send confirmation to driver
      if (accountSid && authToken && twilioPhoneNumber) {
        try {
          const confirmationSms = await client.messages.create({
            body: confirmationMessage,
            from: twilioPhoneNumber,
            to: DRIVER_PHONE,
          });
          console.log("✅ Confirmation SMS sent to driver:", confirmationSms.sid);
        } catch (smsError) {
          console.error("❌ Error sending confirmation SMS:", smsError);
        }
      } else {
        console.log("📱 SIMULATED SMS to driver:");
        console.log("To:", DRIVER_PHONE);
        console.log("Message:", confirmationMessage);
      }

      console.log("🔔 Rider will be notified that ride was accepted");

    } else if (action === "IGNORE") {
      // Update ride status
      rideRequest.status = "ignored";
      activeRideRequests.set(rideId, rideRequest);

      console.log("❌ Driver declined ride:", rideId);

      const declineMessage = `❌ RIDE DECLINED - ${rideId}

You have declined the ride request from ${rideRequest.riderName}.

📍 From: ${rideRequest.pickupLocation}
📍 To: ${rideRequest.dropoffLocation}
💰 Fare: ${rideRequest.estimatedFare.toFixed(4)} TOKENS

🔄 The system will now:
- Notify the rider
- Look for another available driver
- You may receive new ride requests

Thank you for your response! 🚗`;

      // Send confirmation to driver
      if (accountSid && authToken && twilioPhoneNumber) {
        try {
          const declineSms = await client.messages.create({
            body: declineMessage,
            from: twilioPhoneNumber,
            to: DRIVER_PHONE,
          });
          console.log("✅ Decline confirmation SMS sent to driver:", declineSms.sid);
        } catch (smsError) {
          console.error("❌ Error sending decline SMS:", smsError);
        }
      } else {
        console.log("📱 SIMULATED SMS to driver:");
        console.log("To:", DRIVER_PHONE);
        console.log("Message:", declineMessage);
      }

      console.log("🔄 Ride will be reassigned to another driver");
    } else {
      // Invalid command
      console.log("❓ Invalid command received:", messageBody);

      const helpMessage = `❓ INVALID COMMAND: "${Body}"

📋 Valid commands for ride ${rideId}:

✅ ACCEPT ${rideId}
   - To accept the ride request

❌ IGNORE ${rideId}
   - To decline the ride request

💡 Tips:
- Reply with the exact format above
- Include the ride ID: ${rideId}
- Commands are case-insensitive

Please try again! 🚗`;

      if (accountSid && authToken && twilioPhoneNumber) {
        try {
          const helpSms = await client.messages.create({
            body: helpMessage,
            from: twilioPhoneNumber,
            to: DRIVER_PHONE,
          });
          console.log("✅ Help SMS sent to driver:", helpSms.sid);
        } catch (smsError) {
          console.error("❌ Error sending help SMS:", smsError);
        }
      } else {
        console.log("📱 SIMULATED SMS to driver:");
        console.log("To:", DRIVER_PHONE);
        console.log("Message:", helpMessage);
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
