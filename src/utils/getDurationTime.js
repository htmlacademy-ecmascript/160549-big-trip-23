import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getDurationTime = (startDate, endDate) => {
  const diffDuration = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

  const days = diffDuration.get('d');
  const hours = diffDuration.get('h');
  const minutes = diffDuration.get('m');

  const formattedDays = days > 0 ? `${days}D` : '';
  const formattedHours = hours > 0 ? `${hours}H` : formattedDays && '00H';
  const formattedMinutes = minutes > 0 ? `${minutes}M` : formattedHours && '00M';

  return `${formattedDays} ${formattedHours} ${formattedMinutes}`;
};
