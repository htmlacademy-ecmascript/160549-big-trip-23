import {FilterType} from '../constants';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter(({dateFrom}) => dayjs().isAfter(dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter(({dateFrom, dateTo}) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo)),
  [FilterType.FUTURE]: (points) => points.filter(({dateFrom}) => dayjs().isBefore(dateFrom)),
};

export {filter};
