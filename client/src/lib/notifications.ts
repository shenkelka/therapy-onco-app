// Notification service for push notifications and reminders
export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notifications (simplified version)
  public async initialize(): Promise<boolean> {
    try {
      // Only register service worker if supported, but don't require it
      if ('serviceWorker' in navigator) {
        try {
          this.registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', this.registration);
        } catch (error) {
          console.warn('Service Worker registration failed, using direct notifications:', error);
        }
      }

      // Request notification permission
      const permission = await this.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  // Request notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  // Show immediate notification
  public async showNotification(
    title: string,
    body: string,
    type: 'reminder' | 'support' | 'medication' | 'activity' = 'reminder',
    data?: any
  ): Promise<void> {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      throw new Error('Notifications not supported in this browser');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted:', permission);
      throw new Error(`Notification permission: ${permission}`);
    }

    // Create notification with minimal options for better compatibility
    try {
      const options: NotificationOptions = {
        body,
        icon: '/icon-192x192.svg',
        tag: `therapy-${type}`
      };

      // Use service worker if available, otherwise fallback to direct
      if (this.registration && this.registration.active) {
        await this.registration.showNotification(title, options);
        console.log('Service Worker notification shown:', title);
      } else {
        const notification = new Notification(title, options);
        
        // Handle notification events
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
        
        console.log('Direct notification shown:', title);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
      throw error;
    }
  }

  // Schedule medication reminder
  public async scheduleMedicationReminder(
    medicationName: string,
    reminderTime: string,
    message?: string
  ): Promise<void> {
    const title = `💊 Напоминание о приеме лекарства`;
    const body = message || `Время принять ${medicationName}`;

    // For demonstration, show immediate notification
    // In production, this would use a scheduling service
    await this.showNotification(title, body, 'medication', { medicationName, reminderTime });

    // Store in localStorage for persistence
    const reminders = this.getStoredReminders();
    reminders.push({
      id: Date.now(),
      type: 'medication',
      title,
      body,
      scheduledTime: reminderTime,
      medicationName,
      created: new Date().toISOString()
    });
    localStorage.setItem('therapy_reminders', JSON.stringify(reminders));
  }

  // Send supportive message
  public async sendSupportiveMessage(
    message: string,
    treatmentType?: string,
    sideEffects?: string[]
  ): Promise<void> {
    const title = `💚 Поддержка`;
    
    await this.showNotification(title, message, 'support', { treatmentType, sideEffects });
  }

  // Suggest physical activity
  public async suggestActivity(
    activityType: string,
    reason: string
  ): Promise<void> {
    const title = `🏃‍♀️ Рекомендация активности`;
    const body = `${reason}. Попробуйте: ${activityType}`;

    await this.showNotification(title, body, 'activity', { activityType, reason });
  }

  // Get stored reminders
  private getStoredReminders(): any[] {
    try {
      const stored = localStorage.getItem('therapy_reminders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Clear old reminders
  public clearOldReminders(): void {
    const reminders = this.getStoredReminders();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const activeReminders = reminders.filter(
      reminder => new Date(reminder.created) > oneDayAgo
    );
    
    localStorage.setItem('therapy_reminders', JSON.stringify(activeReminders));
  }

  // Check notification support
  public isSupported(): boolean {
    // Check basic notification support
    if (!('Notification' in window)) {
      console.log('Notification API not supported');
      return false;
    }

    // Safari-specific checks
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      console.log('Safari detected, checking compatibility');
      // Safari supports notifications but may have limitations
      return true;
    }

    return true;
  }

  // Get permission status
  public getPermissionStatus(): NotificationPermission {
    return 'Notification' in window ? Notification.permission : 'denied';
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();