export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: '0',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const EMPTY_FILTER_TYPES = {
  Everything: 'everything',
  Past: 'past',
  Present: 'present',
  Future: 'future'
};

export const EMPTY_FILTER_MESSAGES = {
  [EMPTY_FILTER_TYPES.Everything]: 'Click New Event to create your first point',
  [EMPTY_FILTER_TYPES.Past]: 'There are no past events now',
  [EMPTY_FILTER_TYPES.Present]: 'There are no present events now',
  [EMPTY_FILTER_TYPES.Future]: 'There are no future events now'
};
