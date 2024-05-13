import dayjs from 'dayjs';

const DATE_FORMAT = 'HH:mm';

export const getDateTime = (date) => dayjs(date).format(DATE_FORMAT);
