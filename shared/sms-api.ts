// SMS Notification API Types

export interface SendNotificationRequest {
  rideId: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedFare: number;
}

export interface SendNotificationResponse {
  success: boolean;
  message: string;
  rideId: string;
  sid?: string;
  error?: string;
  details?: string;
}

export interface RideStatusResponse {
  success: boolean;
  ride?: {
    id: string;
    riderId: string;
    riderName: string;
    pickupLocation: string;
    dropoffLocation: string;
    estimatedFare: number;
    timestamp: Date;
    status: "pending" | "accepted" | "ignored";
  };
  error?: string;
}

export interface SmsWebhookPayload {
  Body: string;
  From: string;
  To: string;
  MessageSid: string;
  AccountSid: string;
}

// Helper function to format phone number for SMS
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +91 prefix if it's an Indian number (10 digits) and doesn't have country code
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already has country code (11-15 digits), just add +
  if (cleaned.length >= 11 && cleaned.length <= 15) {
    return `+${cleaned}`;
  }
  
  // Return as is if format is unclear
  return phone;
}

// Helper function to generate unique ride ID
export function generateRideId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ride-${timestamp}-${random}`;
}

// Helper function to format fare for display
export function formatFare(fare: number): string {
  return fare.toFixed(4);
}

// Constants
export const DRIVER_PHONE = "+916301214658";
export const SMS_TIMEOUT_SECONDS = 120; // 2 minutes timeout for driver response
