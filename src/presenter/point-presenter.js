import {render, replace} from '../framework/render';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';

export default class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #editingPointFormComponent = null;

  constructor({pointsListContainer}) {
    this.#pointsListContainer = pointsListContainer;
  }

  init(point, destinations, offers) {
    this.#editingPointFormComponent = new EditingFormView({point, destinations, offers, onFormClose: this.#switchToViewMode, onFormSubmit: this.#switchToViewMode});
    this.#pointComponent = new PointView({point, destinations, offers, onEditClick: this.#switchToEditMode});

    render(this.#pointComponent, this.#pointsListContainer);
  }

  #switchToEditMode = () => {
    replace(this.#editingPointFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeydown);
  };

  #switchToViewMode = () => {
    replace(this.#pointComponent, this.#editingPointFormComponent);
    document.removeEventListener('keydown', this.#onEscapeKeydown);
  };

  #onEscapeKeydown = (event) => {
    if (event.key === 'Escape') {
      this.#switchToViewMode();
    }
  };
}
