import asyncio
from urllib.parse import urlparse
from base64 import urlsafe_b64decode, urlsafe_b64encode
from os import urandom, environ

import http_ece
from aiohttp import ClientSession
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from py_vapid import Vapid

VAPID_PRIVATE_KEY = environ['VAPID_PRIVATE_KEY']
VAPID_AUD = 'mailto:' + environ['VAPID_AUD']


class SubscriptionException(Exception):
    pass


def unpadded_urlsafe_b64decode(s):
    return urlsafe_b64decode(s + b'===='[:len(s) % 4])


def unpadded_urlsafe_b64encode(s):
    return urlsafe_b64encode(s).rstrip(b'=')


class Subscription:
    def __init__(self, subscription):
        keys = subscription['keys']

        self.endpoint = urlparse(subscription['endpoint'])
        self.client_auth = unpadded_urlsafe_b64decode(keys['auth'])
        self.client_key = unpadded_urlsafe_b64decode(keys['p256dh'])

    def _encrypt(self, data):
        transaction_private_key = ec.generate_private_key(
            ec.SECP256R1, default_backend())
        transaction_public_key = unpadded_urlsafe_b64encode(
            transaction_private_key
            .public_key()
            .public_numbers()
            .encode_point())
        salt = urandom(16)

        encrypted_payload = http_ece.encrypt(
            data,
            salt=salt,
            keyid=transaction_public_key.decode(),
            private_key=transaction_private_key,
            dh=self.client_key,
            auth_secret=self.client_auth)

        return transaction_public_key, salt, encrypted_payload

    async def send(self, data, vapid_headers, session):
        transaction_public_key, salt, encrypted_payload = self._encrypt(data)

        headers = {
            'Authentication': vapid_headers['Authentication'],
            'Crypto-Key': '{};dh={}'.format(
                vapid_headers['Crypto-Key'], transaction_public_key),
            'Content-Encoding': 'aesgcm',
            'Encryption': 'salt=' + salt.decode('utf8'),
        }

        async with session.post(
                self.endpoint, data=encrypted_payload, headers=headers) as r:
            return hash(self.endpoint), r.status in (201, )


async def limited_push(sem, sub, data, vapid_headers, session):
    async with sem:
        await sub.send(data, vapid_headers, session)


async def web_push_many(subscriptions, data):
    claims = {
        'aud': 'https://fcm.googleapis.com',
        'sub': VAPID_AUD,
    }

    vapid = Vapid.from_string(VAPID_PRIVATE_KEY)
    vapid_headers = vapid.sign(claims)

    sem = asyncio.Semaphore(1000)

    async with ClientSession() as session:
        tasks = [
            asyncio.ensure_future(
                limited_push(sem, sub, data, vapid_headers, session)
            ) for sub in subscriptions
        ]

        responses = asyncio.gather(*tasks)
        await responses
