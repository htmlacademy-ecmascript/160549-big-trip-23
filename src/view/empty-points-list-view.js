import AbstractView from '../framework/view/abstract-view';
import {EMPTY_FILTER_MESSAGES} from '../constants';

const createEmptyPointsListTemplate = (filter) => `<p class="trip-events__msg">${EMPTY_FILTER_MESSAGES[filter]}</p>`;

export default class EmptyPointsListView extends AbstractView {
  #filter = null;
  constructor({filter}) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createEmptyPointsListTemplate(this.#filter);
  }
}
