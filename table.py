from datetime import datetime
from pprint import pprint


class Timeslot:
    DURATION = 150

    def __init__(self, dom, hour, minute=0, stages=tuple()):
        self._minute = ((dom - 1) * 1440) + (hour * 60) + minute
        self._stages = stages

        print(self._minute)

    @classmethod
    def now(cls):
        dt_now = datetime.now()
        return cls(dt_now.date().day, dt_now.hour, dt_now.minute)

    @property
    def dom(self):
        return self._minute // 44640 + 1

    @property
    def hour(self):
        return self._minute // 1440

    @property
    def minute(self):
        return self._minute % 60

    def __add__(self, minutes):
        self._minute = (self._minute + minutes) % 44640

    def __str__(self):
        return f'{self.dom:02} {self.hour:02}:{self.minute:02}'

    def __repr__(self):
        return f'<Timeslot({self.dom:02} {self.hour:02}:{self.minute:02})>'

    def __format__(self, format):
        return str(self)

    def __hash__(self):
        return hash(self._minute)

    def __eq__(self, other):
        return self._minute == other._minute

    def __gt__(self, other):
        return self._minute > other._minute

    def __lt__(self, other):
        return self._minute < other._minute

    def __gte__(self, other):
        return self._minute >= other._minute

    def __lte__(self, other):
        return self._minute <= other.minute


TIMESLOTS = [
    Timeslot(dom, h)
    for dom in range(1, 32)
    for h in range(1, 24, 2)
]


def main():
    pprint(TIMESLOTS)


if __name__ == '__main__':
    main()