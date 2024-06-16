import {SortType} from '../constants';
import {getDateDiff, isDateAfter} from './formatDate';

const sortsByType = {
  [SortType.DAY]: (points) => [...points.sort((firstPoint, secondPoint) => isDateAfter(firstPoint.dateFrom, secondPoint.dateFrom) ? 1 : -1)],
  [SortType.TIME]: (points) => [...points.sort((firstPoint, secondPoint) => getDateDiff(firstPoint.dateFrom, firstPoint.dateTo) - getDateDiff(secondPoint.dateFrom, secondPoint.dateTo))],
  [SortType.PRICE]: (points) => [...points.sort((firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice)]
};

export const sortPointsByType = (points, sortType) => sortsByType[sortType](points);
