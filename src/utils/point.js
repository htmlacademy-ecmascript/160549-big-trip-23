import {SortType} from '../constants';
import {getDateDiff, getDurationTime, isDateAfter, isDatesEqual} from './formatDate';

const sortsByType = {
  [SortType.DAY]: (points) => [...points.sort((firstPoint, secondPoint) => isDateAfter(firstPoint.dateFrom, secondPoint.dateFrom) ? 1 : -1)],
  [SortType.TIME]: (points) => [...points.sort((firstPoint, secondPoint) => getDateDiff(firstPoint.dateFrom, firstPoint.dateTo) - getDateDiff(secondPoint.dateFrom, secondPoint.dateTo))],
  [SortType.PRICE]: (points) => [...points.sort((firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice)]
};

const sortPointsByType = (points, sortType) => sortsByType[sortType](points);

const isMinorChanges = (prevPoint, updatedPoint) => {
  const isDateChanged = !isDatesEqual(updatedPoint.dateFrom, prevPoint.dateFrom);
  const isBasePriceChanged = updatedPoint.basePrice !== prevPoint.basePrice;
  const isDurationChanged = getDurationTime(updatedPoint.dateFrom, updatedPoint.dateTo) !== getDurationTime(prevPoint.dateFrom, prevPoint.dateTo);

  return isDateChanged || isBasePriceChanged || isDurationChanged;
};

export {
  sortPointsByType,
  isMinorChanges,
};
