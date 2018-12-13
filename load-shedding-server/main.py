import asyncio
import logging
from datetime import datetime

from aiohttp import web, ClientSession

from db import load_data, async_save_data, db_get, db_set

logging.basicConfig(level=logging.DEBUG)

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


async def load_shedding_stage(request):
    stage = db_get('stage')
    return web.json_response({
        'stage': stage,
        'load_shedding': bool(stage),
    })


async def subscribe(request):
    try:
        endpoint = (await request.json())['endpoint']
        print('New subscription: {}'.format(endpoint))

        notification_clients = db_get('notification_clients')

        if endpoint not in notification_clients:
            notification_clients.append(endpoint)
            await async_save_data(asyncio.get_event_loop())

        return web.json_response({
            'success': True,
        })
    except Exception as e:
        print(e)
        return web.json_response({
            'success': False,
        })


load_data()

asyncio.ensure_future(update_stage())

app = web.Application()
app.add_routes([
    web.get('/load_shedding_stage', load_shedding_stage),
    web.post('/subscribe', subscribe),
])

web.run_app(app)
