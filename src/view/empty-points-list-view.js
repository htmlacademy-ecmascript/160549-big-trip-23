import AbstractView from '../framework/view/abstract-view';
import {EmptyFilterMessage} from '../constants';

const createEmptyPointsListTemplate = (filter) => `<p class="trip-events__msg">${EmptyFilterMessage[filter]}</p>`;

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
