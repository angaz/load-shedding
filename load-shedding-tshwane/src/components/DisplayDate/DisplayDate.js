import React from 'react';

const getDate = date => {
  const dom = date.getDate();
  const superscript = ['st','nd','rd'][((dom + 90) % 100 - 10) % 10 - 1] || 'th';

  return (
    <span>
      {dom} <sup>{superscript}</sup>
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
  const nDays = daysDiff(Date.now(), date);

  if (nDays === 0) {
    return <span>Today</span>;
  } else if (nDays === 1) {
    return <span>Tomorrow</span>;
  } else {
    return (
      <span>
        {getDay(date)} {getDate(date)} of {getMonth(date)} {date.getFullYear()}
      </span>
    );
  }
};
