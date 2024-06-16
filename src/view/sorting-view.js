import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../constants';

const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFERS];

function createSortingItem(sortBy, isActive) {
  const isChecked = isActive ? 'checked' : '';
  const isDisabled = DISABLED_SORT_TYPES.includes(sortBy) ? 'disabled' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortBy}">
       <input id="sort-${sortBy}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${sortBy}" value="sort-${sortBy}" ${isChecked} ${isDisabled}>
       <label class="trip-sort__btn" for="sort-${sortBy}">${sortBy}</label>
     </div>
  `);
}

function createSortingTemplate(activeSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${Object.values(SortType).map((type) => createSortingItem(type, type === activeSortType)).join('')}
    </form>`
  );
}

export default class SortingView extends AbstractView {
  #sortType = null;
  #handleSortTypeChange = null;

  constructor({sortType, onSortTypeChange}) {
    super();
    this.#sortType = sortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#onChange);
  }

  get template() {
    return createSortingTemplate(this.#sortType);
  }

  #onChange = (event) => {
    this.#handleSortTypeChange?.(event.target.dataset.sortType);
  };
}
