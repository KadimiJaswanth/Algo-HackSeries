import { 
  SendNotificationRequest, 
  SendNotificationResponse, 
  RideStatusResponse,
  generateRideId,
  formatFare 
} from '@shared/sms-api';

export class SmsNotificationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.location.origin;
  }

  async sendDriverNotification(
    riderName: string,
    pickupLocation: string,
    dropoffLocation: string,
    estimatedFare: number,
    riderId?: string
  ): Promise<{ success: boolean; rideId: string; message: string }> {
    try {
      const rideId = generateRideId();
      
      const requestData: SendNotificationRequest = {
        rideId,
        riderId: riderId || 'rider-' + Date.now(),
        riderName,
        pickupLocation,
        dropoffLocation,
        estimatedFare,
      };

      console.log('Sending SMS notification for ride:', requestData);

      const response = await fetch(`${this.baseUrl}/api/sms/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result: SendNotificationResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification');
      }

      console.log('SMS notification sent successfully:', result);

      return {
        success: result.success,
        rideId: result.rideId,
        message: result.message,
      };
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      throw error;
    }
  }

  async getRideStatus(rideId: string): Promise<RideStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sms/ride-status/${rideId}`);
      const result: RideStatusResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get ride status');
      }

      return result;
    } catch (error) {
      console.error('Error getting ride status:', error);
      throw error;
    }
  }

  // Poll for ride status updates
  async pollRideStatus(
    rideId: string,
    onStatusUpdate: (status: 'pending' | 'accepted' | 'ignored') => void,
    intervalMs: number = 3000,
    timeoutMs: number = 120000 // 2 minutes
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const poll = async () => {
        try {
          // Check if timeout reached
          if (Date.now() - startTime > timeoutMs) {
            onStatusUpdate('ignored'); // Assume ignored if timeout
            resolve();
            return;
          }

          const statusResponse = await this.getRideStatus(rideId);
          
          if (statusResponse.success && statusResponse.ride) {
            const status = statusResponse.ride.status;
            onStatusUpdate(status);
            
            // Stop polling if ride is accepted or ignored
            if (status === 'accepted' || status === 'ignored') {
              resolve();
              return;
            }
          }

          // Continue polling
          setTimeout(poll, intervalMs);
        } catch (error) {
          console.error('Error polling ride status:', error);
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  }

  // Helper method to format notification details for UI
  formatNotificationDetails(
    riderName: string,
    pickupLocation: string,
    dropoffLocation: string,
    estimatedFare: number
  ): string {
    return `📱 SMS sent to driver (6301214658)
    
Ride Details:
• Rider: ${riderName}
• From: ${pickupLocation}
• To: ${dropoffLocation}
• Fare: ${formatFare(estimatedFare)} TOKENS

The driver can reply via SMS to accept or ignore this ride request.`;
  }

  // Helper method to get estimated response time
  getEstimatedResponseTime(): string {
    return "Driver typically responds within 1-2 minutes via SMS";
  }
}

// Singleton instance
export const smsService = new SmsNotificationService();

// Helper hooks for React components
export function useSmsNotification() {
  const sendNotification = async (
    riderName: string,
    pickupLocation: string,
    dropoffLocation: string,
    estimatedFare: number
  ) => {
    return smsService.sendDriverNotification(
      riderName,
      pickupLocation,
      dropoffLocation,
      estimatedFare
    );
  };

  const pollStatus = async (
    rideId: string,
    onStatusUpdate: (status: 'pending' | 'accepted' | 'ignored') => void
  ) => {
    return smsService.pollRideStatus(rideId, onStatusUpdate);
  };

  return {
    sendNotification,
    pollStatus,
    formatDetails: smsService.formatNotificationDetails.bind(smsService),
    getEstimatedResponseTime: smsService.getEstimatedResponseTime.bind(smsService),
  };
}
