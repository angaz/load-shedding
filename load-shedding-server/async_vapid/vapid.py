import json
from base64 import urlsafe_b64encode

from fastecdsa import curve, ecdsa, keys
from fastecdsa.keys import import_key


def unpadded_urlsafe_b64encode(data):
    return urlsafe_b64encode(data).rstrip(b'=')


def int_to_bytes(i):
    return i.to_bytes(32, byteorder='big')


class Vapid:
    SCHEMA = "vapid"

    def __init__(self, private_key, public_key=None):
        self._private_key = private_key
        self._public_key = (
            public_key or
            keys.get_public_key(private_key, curve.P256))

    @property
    def private_key(self):
        return self._private_key

    @property
    def public_key_bytes(self):
        return unpadded_urlsafe_b64encode(b''.join((
            b'\x04',
            int_to_bytes(self._public_key.x),
            int_to_bytes(self._public_key.y),
        )))

    @classmethod
    def from_key_file(cls, filename):
        d, Q = import_key(filename)
        return cls(d, Q)

    def generate_jwt(self, claims):
        payload = unpadded_urlsafe_b64encode(
            json.dumps(
                claims,
                separators=(',', ':'),
                sort_keys=True).encode('utf8'))

        # urlsafe_b64encode('{"alg":"ES256","typ":"JWT"}')
        token = b'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.' + payload

        r, s = ecdsa.sign(token.decode('utf8'), self._private_key)
        signature = unpadded_urlsafe_b64encode(
            int_to_bytes(r) + int_to_bytes(s))

        return b'.'.join((token, signature))

    def generate_auth_header(self, claims):
        return {
            'Authorization': '{schema} t={token},k={key}'.format(
                schema=self.SCHEMA,
                token=self.generate_jwt(claims).decode('utf8'),
                key=self.public_key_bytes.decode('utf8'),
            )
        }
