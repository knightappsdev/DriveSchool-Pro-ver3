// Push Notification Handler for DriveSchool Pro
// This script handles push notifications and service worker messaging

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, badge, tag, requireInteraction } = event.data.payload;
    
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/icon-72x72.png',
      tag: tag || 'driving-school-notification',
      requireInteraction: requireInteraction || false,
      data: {
        url: self.location.origin,
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/icon-72x72.png'
        }
      ]
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // If app is already open, focus it
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If app is not open, open it
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Handle push events (for server-sent push notifications)
self.addEventListener('push', event => {
  let notificationData = {};
  
  try {
    if (event.data) {
      notificationData = event.data.json();
    }
  } catch (e) {
    notificationData = {
      title: '🚗 DriveSchool Pro',
      body: 'You have a new notification!',
      icon: '/icons/icon-192x192.png'
    };
  }
  
  const options = {
    body: notificationData.body || 'New notification from DriveSchool Pro',
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: notificationData.tag || 'push-notification',
    requireInteraction: true,
    data: {
      url: notificationData.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/icon-72x72.png'  
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || '🚗 DriveSchool Pro', 
      options
    )
  );
});

console.log('🔔 DriveSchool Pro notification handler loaded');