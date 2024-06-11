import {render} from '../framework/render';
import FiltersView from '../view/filters-view';

export default class HeaderPresenter {
  #headerContainer = null;

  #filtersComponent = new FiltersView();

  constructor({headerContainer}) {
    this.#headerContainer = headerContainer;
  }

  init() {
    render(this.#filtersComponent, this.#headerContainer);
  }
}
