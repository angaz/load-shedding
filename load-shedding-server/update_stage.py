import asyncio
from datetime import datetime

from aiohttp import ClientSession

from db import db_get, db_set, async_save_data


STATUS_URL = 'http://loadshedding.eskom.co.za/LoadShedding/getstatus'


async def update_stage():
    loop = asyncio.get_event_loop()

    async with ClientSession(loop=loop) as session:
        while True:
            async with session.get(STATUS_URL) as response:
                stage = await response.text()
                try:
                    stage = int(stage) - 1
                    if stage != db_get('stage'):
                        print(
                            f'[{datetime.now()}] '
                            f'Stage changed from {db_get("stage")} to {stage}')
                        db_set('stage', stage)
                        await async_save_data(loop)

                except ValueError as e:
                    print(f'[{datetime.now()}] {e}')
                    continue

            await asyncio.sleep(300)
