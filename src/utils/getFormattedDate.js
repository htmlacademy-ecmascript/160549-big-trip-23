import dayjs from 'dayjs';

const DATE_FORMAT = 'DD MMM';

export const getFormattedDate = (date) => dayjs(date).format(DATE_FORMAT);
