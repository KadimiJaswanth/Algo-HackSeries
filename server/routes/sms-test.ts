import { RequestHandler } from "express";
import twilio from "twilio";

interface SimulateSmsRequest {
  message: string;
  rideId?: string;
}

export const simulateDriverSms: RequestHandler = async (req, res) => {
  try {
    const { message, rideId }: SimulateSmsRequest = req.body;

    console.log("🧪 SIMULATING SMS RESPONSE:");
    console.log("- Message:", message);
    console.log("- Ride ID:", rideId);

    // Create a mock SMS webhook payload
    const mockWebhookPayload = {
      Body: message,
      From: "+916301214658", // Driver's phone number
      To: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
      MessageSid: `SM_test_${Date.now()}`,
      AccountSid: process.env.TWILIO_ACCOUNT_SID || "AC_test",
    };

    // Call the existing webhook handler
    const mockRequest = {
      body: mockWebhookPayload,
    } as any;

    const mockResponse = {
      status: (code: number) => ({
        send: (data: any) => {
          console.log("📤 Mock webhook response:", code, data);
          return mockResponse;
        },
        json: (data: any) => {
          console.log("📤 Mock webhook JSON response:", code, data);
          return mockResponse;
        },
      }),
    } as any;

    // Import and call the webhook handler
    const { handleSmsWebhook } = await import("./sms-notifications");
    await handleSmsWebhook(mockRequest, mockResponse, () => {});

    res.json({
      success: true,
      message: "SMS response simulated successfully",
      simulatedMessage: message,
      rideId: rideId || "extracted from message",
    });
  } catch (error) {
    console.error("Error simulating SMS:", error);
    res.status(500).json({
      success: false,
      error: "Failed to simulate SMS response",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getTestCommands: RequestHandler = async (req, res) => {
  try {
    const { rideId } = req.params;

    const commands = {
      accept: `ACCEPT ${rideId}`,
      ignore: `IGNORE ${rideId}`,
      invalid: `HELLO ${rideId}`,
      examples: [
        {
          command: `ACCEPT ${rideId}`,
          description: "Driver accepts the ride",
          result: "Confirmation SMS with pickup details sent to driver",
        },
        {
          command: `IGNORE ${rideId}`,
          description: "Driver declines the ride",
          result: "Decline confirmation SMS sent to driver",
        },
        {
          command: `INVALID ${rideId}`,
          description: "Invalid command format",
          result: "Help message with correct format sent to driver",
        },
      ],
    };

    res.json({
      success: true,
      rideId,
      commands,
      note: "Use POST /api/sms/simulate-response to test these commands",
    });
  } catch (error) {
    console.error("Error getting test commands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get test commands",
    });
  }
};

// Direct SMS sending test (using your provided code)
export const testDirectSms: RequestHandler = async (req, res) => {
  try {
    const { to, body } = req.body;

    // Twilio client setup
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );

    // Send SMS (your code logic)
    const message = await client.messages.create({
      body: body || "Your ride is confirmed!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to || "+919876543210", // must be in E.164 format
    });

    console.log("Message sent:", message.sid);

    res.json({
      success: true,
      message: "SMS sent successfully",
      sid: message.sid,
      to: to || "+919876543210",
      body: body || "Your ride is confirmed!",
    });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send SMS",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default {
  simulateDriverSms,
  getTestCommands,
  testDirectSms,
};
