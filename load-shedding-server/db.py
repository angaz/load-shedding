import pickle

DATABASE_FILE = 'database.pickle'

DATA = {
    'use_eskom': True,
    'stage': 0,
    'notification_clients': [],
}


def db_get(key):
    return DATA[key]


def db_set(key, value):
    DATA[key] = value


def save_data():
    with open(DATABASE_FILE, 'wb') as f:
        pickle.dump(DATA, f)


def load_data():
    global DATA
    try:
        with open(DATABASE_FILE, 'rb') as f:
            DATA = pickle.load(f)
    except FileNotFoundError:
        save_data()


async def async_save_data(loop):
    await loop.run_in_executor(None, save_data)


async def async_load_data(loop):
    await loop.run_in_executor(None, load_data)
