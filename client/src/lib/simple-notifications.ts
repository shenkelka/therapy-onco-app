// Simplified notification service for maximum browser compatibility
class SimpleNotificationService {
  
  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      console.log('Permission request result:', result);
      return result;
    } catch (error) {
      console.error('Permission request failed:', error);
      return 'denied';
    }
  }

  // Show notification with basic options
  async showNotification(title: string, body: string): Promise<boolean> {
    console.log('Attempting to show notification:', { title, body });

    if (!this.isSupported()) {
      console.error('Notifications not supported');
      return false;
    }

    const permission = this.getPermissionStatus();
    if (permission !== 'granted') {
      console.warn('No notification permission:', permission);
      return false;
    }

    try {
      // Create notification with minimal options for maximum compatibility
      const notification = new Notification(title, {
        body: body,
        icon: '/icon-192x192.svg'
      });

      console.log('Notification created successfully');

      // Handle click to focus window
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
        console.log('Notification auto-closed');
      }, 5000);

      return true;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return false;
    }
  }

  // Initialize (just request permission)
  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    const permission = await this.requestPermission();
    const success = permission === 'granted';
    
    if (success) {
      console.log('Simple notifications initialized successfully');
    } else {
      console.warn('Failed to get notification permission:', permission);
    }
    
    return success;
  }
}

// Create and export singleton
export const simpleNotificationService = new SimpleNotificationService();