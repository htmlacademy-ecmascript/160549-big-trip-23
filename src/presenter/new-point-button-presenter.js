import {render} from '../framework/render.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class NewPointButtonPresenter {
  #headerContainer = null;
  #buttonComponent = null;

  constructor({ headerContainer }) {
    this.#headerContainer = headerContainer;
  }

  init() {
    this.#buttonComponent = new NewPointButtonView();
    render(this.#buttonComponent, this.#headerContainer);
  }
}
