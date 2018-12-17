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
    const oldStage = localStorage.getItem('stage') || 'no load shedding';
    const newStage = eventJson.stage || 'no load shedding';
    localStorage.setItem('stage', eventJson.stage);

    notification.title = `Stage ${oldStage} => ${newStage}`;
    notification.options.body = `Eskom has changed the load shedding stage ${oldStage} to ${newStage}`;

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
