import {render, RenderPosition} from '../framework/render';
import HeaderView from '../view/header-view';

export default class HeaderPresenter {
  #headerContainer = null;

  #headerInfoComponent = new HeaderView();

  constructor({headerContainer}) {
    this.#headerContainer = headerContainer;
  }

  init() {
    render(this.#headerInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }
}
