import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DATE_FORMAT = 'DD MMM';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'YYYY-MM-DD';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';


const getTime = (date) => dayjs(date).format(TIME_FORMAT);
const getDayMonth = (date) => dayjs(date).format(DATE_FORMAT);
const getFullDate = (date) => dayjs(date).format(FULL_DATE_FORMAT);
const getFullDateTime = (date) => dayjs(date).format(FULL_DATE_TIME_FORMAT);


const getDurationTime = (startDate, endDate) => {
  const diffDuration = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

  const days = diffDuration.get('d');
  const hours = diffDuration.get('h');
  const minutes = diffDuration.get('m');

  const formattedDays = days > 0 ? `${days}D` : '';
  const formattedHours = hours > 0 ? `${hours}H` : formattedDays && '00H';
  const formattedMinutes = minutes > 0 ? `${minutes}M` : formattedHours && '00M';

  return `${formattedDays} ${formattedHours} ${formattedMinutes}`;
};

const isDateAfter = (date1, date2) => dayjs(date1).isAfter(dayjs(date2));

const getDateDiff = (date1, date2) => dayjs(date1).diff(date2);

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
