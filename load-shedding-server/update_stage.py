import asyncio
import json
from datetime import datetime
from time import time

from aiohttp import ClientSession

from db import db_get, db_set, async_save_data
from async_web_push import web_push_many


STATUS_URL = 'https://loadshedding.eskom.co.za/LoadShedding/GetStatus'


def status_url():
    return STATUS_URL + f'?_={int(time() * 1000)}'


async def push(old_stage, new_stage):
    push_data = {
        'push_type': 'stage_change',
        'stage': new_stage,
    }

    await web_push_many(
        db_get('notification_clients').values(),
        json.dumps(push_data, separators=(',', ':')).encode())


async def update_stage():
    loop = asyncio.get_event_loop()

    async with ClientSession(loop=loop) as session:
        while True:
            try:
                async with session.get(status_url()) as response:
                    stage = await response.text()
                    try:
                        stage = int(stage) - 1
                        old_stage = db_get('stage')
                        if stage != old_stage:
                            if stage < 0:
                                raise ValueError('Stage less than 0')

                            print(
                                f'[{datetime.now()}] '
                                f'Stage changed from {old_stage} to {stage}')

                            db_set('stage', stage)
                            await async_save_data(loop)
                            await push(old_stage, stage)

                    except ValueError as e:
                        print(f'[{datetime.now()}] :54 {e}')
            except Exception as e:
                print(f'[{datetime.now()}] :58 {e}')

            await asyncio.sleep(300)
