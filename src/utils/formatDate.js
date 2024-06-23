import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {DateFormat} from '../constants';
dayjs.extend(duration);


const getTime = (date) => dayjs(date).format(DateFormat.TIME);
const getDayMonth = (date) => dayjs(date).format(DateFormat.DAY_MONTH);
const getFullDate = (date) => dayjs(date).format(DateFormat.DATE);
const getFullDateTime = (date) => dayjs(date).format(DateFormat.DATE_TIME);
const getDateDiff = (date1, date2) => dayjs(date1).diff(date2);

const getDurationTime = (startDate, endDate) => {
  const diffDuration = dayjs.duration(getDateDiff(endDate, startDate));
  if (diffDuration.days()) {
    return diffDuration.format(DateFormat.DAY);
  }

  if (diffDuration.hours()) {
    return diffDuration.format(DateFormat.HOUR);
  }

  return diffDuration.format(DateFormat.MINUTE);

};

const isDateAfter = (date1, date2) => dayjs(date1).isAfter(dayjs(date2));

const isDatesEqual = (date1, date2) => dayjs(date1).isSame(date2);

export {
  getFullDate,
  getFullDateTime,
  getDayMonth,
  getTime,
  getDurationTime,
  isDateAfter,
  getDateDiff,
  isDatesEqual
};
