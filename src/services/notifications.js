const NOTIFICATION_PERMISSION_GRANTED = 'granted';
const NOTIFICATION_PERMISSION_DENIED = 'denied';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === NOTIFICATION_PERMISSION_GRANTED;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export function checkNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === NOTIFICATION_PERMISSION_GRANTED;
}

export function scheduleNotification(time, userId) {
  if (!checkNotificationPermission()) {
    return;
  }

  const [hours, minutes] = time.split(':');
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(hours),
    parseInt(minutes)
  );

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  // Store the timeout ID with the user ID to be able to cancel it later
  const timeoutId = setTimeout(() => {
    showNotification();
    // Reschedule for the next day
    scheduleNotification(time, userId);
  }, timeUntilNotification);

  // Store the timeout ID in localStorage to persist across page reloads
  const storedTimeouts = JSON.parse(localStorage.getItem('notificationTimeouts') || '{}');
  storedTimeouts[userId] = timeoutId;
  localStorage.setItem('notificationTimeouts', JSON.stringify(storedTimeouts));
}

export function cancelScheduledNotification(userId) {
  const storedTimeouts = JSON.parse(localStorage.getItem('notificationTimeouts') || '{}');
  const timeoutId = storedTimeouts[userId];

  if (timeoutId) {
    clearTimeout(timeoutId);
    delete storedTimeouts[userId];
    localStorage.setItem('notificationTimeouts', JSON.stringify(storedTimeouts));
  }
}

function showNotification() {
  if (!checkNotificationPermission()) {
    return;
  }

  const motivationalMessages = [
    'Stay strong! Every day without smoking is a victory.',
    'You're doing great! Your body is healing more each day.',
    'Remember why you started. You've got this!',
    'Think about the money you're saving by not smoking.',
    'Your lungs are thanking you for staying smoke-free!',
    'Craving? Try some deep breathing exercises.',
    'You're breaking free from addiction. Keep going!',
    'Your health is improving every smoke-free day.',
    'Celebrate your progress! You deserve it.',
    'Need support? Open the app for coping strategies.',
  ];

  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const notification = new Notification('Quitter - Stay Smoke-Free!', {
    body: message,
    icon: '/logo192.png', // Make sure this icon exists in your public folder
    badge: '/logo192.png',
    tag: 'daily-reminder',
    requireInteraction: true,
  });

  notification.onclick = function() {
    window.focus();
    notification.close();
  };
}

// Function to handle service worker registration for push notifications
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}
