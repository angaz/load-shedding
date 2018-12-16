import asyncio
import logging

from aiohttp import web

from db import load_data, async_save_data, db_get
from update_stage import update_stage

logging.basicConfig(level=logging.DEBUG)


async def load_shedding_stage(request):
    stage = db_get('stage')
    return web.json_response({
        'stage': stage,
        'load_shedding': bool(stage),
    })


async def subscribe(request):
    try:
        sub_json = await request.json()
        print(f'New subscription: {sub_json}')

        notification_clients = db_get('notification_clients')

        if sub_json['endpoint'] not in notification_clients:
            notification_clients[sub_json['endpoint']] = sub_json
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
