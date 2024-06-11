import {render} from '../framework/render';
import FiltersView from '../view/filters-view';

export default class HeaderPresenter {
  filtersComponent = new FiltersView();

  constructor({headerContainer}) {
    this.headerContainer = headerContainer;
  }

  init() {
    render(this.filtersComponent, this.headerContainer);
  }
}
