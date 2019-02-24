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
VAPID_SUB = 'mailto:' + environ['VAPID_SUB']


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
        self.client_auth = unpadded_urlsafe_b64decode(keys['auth'].encode('utf8'))
        self.client_key = unpadded_urlsafe_b64decode(keys['p256dh'].encode('utf8'))

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
            auth_secret=self.client_auth,
            version='aesgcm',
        )

        return transaction_public_key, salt, encrypted_payload

    async def send(self, data, vapid_headers, session):
        transaction_pk, salt, payload = self._encrypt(data)

        url = self.endpoint.geturl()
        headers = {
            'Authorization': vapid_headers['Authorization'],
            'Crypto-Key': '{};dh={}'.format(
                vapid_headers['Crypto-Key'], transaction_pk.decode()),
            'Encryption': 'salt=' + unpadded_urlsafe_b64encode(salt).decode(),
            'Content-Encoding': 'aesgcm',
            'ttl': '30',
        }

        async with session.post(url, data=payload, headers=headers) as r:
            return hash(self.endpoint), r.status in (201, )


async def limited_push(sem, sub, data, vapid_headers, session):
    async with sem:
        await sub.send(data, vapid_headers, session)


async def web_push_many(subscriptions, data):
    claims = {
        'aud': 'https://fcm.googleapis.com',
        'sub': VAPID_SUB,
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
