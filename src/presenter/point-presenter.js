import {render, replace, remove} from '../framework/render';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';

export default class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #editingPointFormComponent = null;

  #point = null;
  #onChangePoint = null;

  constructor({pointsListContainer, onChangePoint}) {
    this.#pointsListContainer = pointsListContainer;
    this.#onChangePoint = onChangePoint;
  }

  init(point, destinations, offers) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditingPointFormComponent = this.#editingPointFormComponent;

    this.#editingPointFormComponent = new EditingFormView({point, destinations, offers, onFormClose: this.#switchToViewMode, onFormSubmit: this.#switchToViewMode});
    this.#pointComponent = new PointView({point, destinations, offers, onEditClick: this.#switchToEditMode, onToggleFavorite: this.#onFavoriteToggle});

    if (prevPointComponent === null || prevEditingPointFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    // Проверка на наличие в DOM
    if (this.#pointsListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointsListContainer.contains(prevEditingPointFormComponent.element)) {
      replace(this.#editingPointFormComponent, prevEditingPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditingPointFormComponent);

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

  #onFavoriteToggle = () => {
    this.#onChangePoint?.({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
