import AbstractView from '../framework/view/abstract-view';
import {getIsCheckedAttribute, getIsDisabledAttribute} from '../utils/common';

function createFilterItem(filter, isActive, isDisabled) {
  const checked = getIsCheckedAttribute(isActive);
  const disabled = getIsDisabledAttribute(isDisabled);

  return (
    `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${checked} ${disabled}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`
  );
}

function createFiltersTemplate(filters, currentFilterType) {

  return (
    `<form class="trip-filters" action="#" method="get">
     ${filters.map(({filterType, isDisabled}) => createFilterItem(filterType, filterType === currentFilterType, isDisabled)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);

  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#onFilterTypeChange?.(event.target.value);
  };
}
