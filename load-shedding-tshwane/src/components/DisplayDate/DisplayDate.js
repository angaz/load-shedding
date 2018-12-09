import React from 'react';

const getDate = date => {
  date = date.getDate();

  return (<span>{date}<sup>{['st','nd','rd'][((date + 90) % 100 - 10) % 10 - 1] || 'th'}</sup></span>);
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

const daysDiff = (now, date) => Math.floor((now - date) / 86400000);

export default ({ date }) => {
  let text = '';

  switch (daysDiff(new Date(), date)) {
    case 0:
      text = 'Today'
      break;
    case 1:
      text = 'Tomorrow'
      break;
    default:
      text = `${getDay(date)} ${getDate(date)} of ${getMonth(date)} ${date.getYear()}`
  }

  return (
    <div>
      <span>{text}</span>
    </div>
  )
};
