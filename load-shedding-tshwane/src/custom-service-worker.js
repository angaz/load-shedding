/* eslint no-restricted-globals: 0 */

self.addEventListener('push', event => {
  console.log('A push event fired!');

  const eventJson = event.data.json();
  console.log(eventJson);

  event.waitUntil(
    self.registration.showNotification(
      eventJson.title,
      eventJson.options,
    )
  );
});
