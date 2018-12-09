import React from 'react';

const getDate = date => {
  const dom = date.getDate();

  return (
    <span>
      {dom}
      <sup>
        {['st','nd','rd'][((dom + 90) % 100 - 10) % 10 - 1] || 'th'}
      </sup>
    </span>
  );
}

const getDay = date => [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
][date.getDay()];

const getMonth = date => [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
][date.getMonth()];

const daysDiff = (now, date) => Math.abs(Math.floor((now - date) / 86400000));

export default ({ date }) => {
  let text = '';
  const nDays = daysDiff(Date.now(), date);

  if (nDays === 0) {
    text = 'Today';
  } else if (nDays === 1) {
    text = 'Tomorrow';
  } else {
    text = `${getDay(date)} ${getDate(date)} of ${getMonth(date)} ${date.getYear()}`;
  }

  return (
    <div>
      <span>{text}</span>
    </div>
  )
};
