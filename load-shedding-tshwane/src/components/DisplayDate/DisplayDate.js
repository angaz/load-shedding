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

export default ({ date }) => (
  <div>
    <span>{getDay(date)} {getDate(date)} of {getMonth(date)} {date.getYear()}</span>
  </div>
);
