export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: '0',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const FilterTypes = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

export const EmptyFilterMessages = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.PAST]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.FUTURE]: 'There are no future events now'
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};
