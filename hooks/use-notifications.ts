'use client';

import { useState, useEffect } from 'react';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: any[];
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Register notification handler if service worker is available
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          console.log('🔔 Service worker ready for notifications');
        }).catch(err => {
          console.log('Service worker not available for notifications:', err);
        });
      }
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (permission === 'granted') {
      return permission;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  };

  const showNotification = async (options: NotificationOptions): Promise<void> => {
    if (!isSupported) {
      throw new Error('Notifications are not supported');
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        throw new Error('Notification permission denied');
      }
    }

    // Check if service worker is available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Use service worker for notifications
        if (registration.active) {
          registration.active.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: options,
          });
        } else {
          // Fallback to direct notification
          new Notification(options.title, {
            body: options.body,
            icon: options.icon || '/icons/icon-192x192.png',
            badge: options.badge || '/icons/icon-72x72.png',
            tag: options.tag,
            requireInteraction: options.requireInteraction,
            silent: options.silent,
          });
        }
      }).catch(() => {
        // Fallback to regular notification if SW fails
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          badge: options.badge || '/icons/icon-72x72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
        });
      });
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/icon-72x72.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
      });
    }
  };

  const showBookingConfirmation = (courseName: string, instructorName: string) => {
    showNotification({
      title: '🎉 Booking Confirmed!',
      body: `Your ${courseName} lesson with ${instructorName} has been booked successfully.`,
      tag: 'booking-confirmation',
      requireInteraction: true,
    });
  };

  const showLessonReminder = (courseName: string, time: string) => {
    showNotification({
      title: '⏰ Lesson Reminder',
      body: `Your ${courseName} lesson starts at ${time}. Don't forget!`,
      tag: 'lesson-reminder',
      requireInteraction: true,
    });
  };

  const showWelcomeNotification = () => {
    showNotification({
      title: '🚗 Welcome to Ofemo Driving School!',
      body: 'Thanks for installing our app. Book your first lesson today!',
      tag: 'welcome',
      requireInteraction: false,
    });
  };

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showBookingConfirmation,
    showLessonReminder,
    showWelcomeNotification,
  };
}