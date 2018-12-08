import asyncio
from datetime import datetime

from aiohttp import web, ClientSession

STATUS_URL = 'http://loadshedding.eskom.co.za/LoadShedding/getstatus'

STAGE = 0


async def update_stage():
    async with ClientSession() as session:
        while True:
            global STAGE
            async with session.get(STATUS_URL) as response:
                stage = await response.text()
                try:
                    stage = int(stage) - 1
                    if stage != STAGE:
                        print(
                            f'[{datetime.now()}] '
                            f'Stage changed from {STAGE} to {stage}')
                        STAGE = stage
                except ValueError as e:
                    print(f'[{datetime.now()}] {e}')
                    continue

            await asyncio.sleep(300)


async def load_shedding_stage(request):
    return web.json_response({
        'stage': STAGE,
        'load_shedding': bool(STAGE),
    })


asyncio.ensure_future(update_stage())

app = web.Application()
app.add_routes([web.get('/load_shedding_stage', load_shedding_stage)])

web.run_app(app)
