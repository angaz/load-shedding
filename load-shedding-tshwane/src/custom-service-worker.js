/* eslint no-restricted-globals: 0 */

self.addEventListener('push', event => {
  const eventJson = event.data.json();
  const notification = {
    title: '',
    options: {
      body: '',
      icon: 'icon192.png',
      badge: 'icon192.png',
    },
  };

  if (eventJson.push_type === 'stage_change') {
    const newStage = eventJson.stage;

    notification.title = newStage
      ? `Load shedding stage: ${newStage}`
      : 'Load shedding has ended for today';

    if (newStage === 0) {
      notification.options.badge = 'power192.png';
    }
  } else {
    return;
  }

  event.waitUntil(
    self.registration.showNotification(
      notification.title,
      notification.options,
    )
  );
});
