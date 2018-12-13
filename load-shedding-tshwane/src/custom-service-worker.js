/* eslint no-restricted-globals: 0 */

self.addEventListener('push', event => {
  const eventJson = event.data.json();

  event.waitUntil(
    self.registration.showNotification(
      eventJson.title,
      eventJson.options
    )
  );
});
