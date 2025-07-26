// Service Worker for push notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const { title, body, icon, badge, tag, data: notificationData } = data;

  const options = {
    body,
    icon: icon || '/icon-192x192.svg',
    badge: badge || '/icon-192x192.svg',
    tag: tag || 'therapy-notification',
    data: notificationData,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // If app is already open, focus it
      for (const client of clients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});