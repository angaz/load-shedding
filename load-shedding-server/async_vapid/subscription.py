from urllib.parse import urlparse


class Subscription:
    CONTENT_ENCODING = 'aes128gcm'

    def __init__(self, subscription_info):
        self._endpoint = urlparse(subscription_info['endpoint'])
        self._expiration_time = subscription_info.get('expirationTime', None)

        keys = subscription_info['keys']
        self._keys_p256dh = keys['p256dh']
        self._keys_auth = keys['auth']

        self._aud = f'{self._endpoint.scheme}://{self._endpoint.netloc}'

    @property
    def endpoint(self):
        return self._endpoint

    @property
    def endpoint_url(self):
        return self._endpoint.geturl()

    @property
    def aud(self):
        return self._aud

    @property
    def keys(self):
        return {
            'p256dh': self._keys_p256dh,
            'auth': self._keys_auth,
        }

    def aes128gcm_encode(data):
        pass

    async def send(data, vapid):
        pass
