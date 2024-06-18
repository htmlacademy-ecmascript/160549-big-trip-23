import {render, replace, remove} from '../framework/render';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING:'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #editingPointFormComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #onPointChange = null;
  #onModeChange = null;

  constructor({pointsListContainer, onPointChange, onModeChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }

  init(point, destinations, offers) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditingPointFormComponent = this.#editingPointFormComponent;

    this.#editingPointFormComponent = new EditingFormView({
      point,
      destinations,
      offers,
      onFormClose: this.#switchToViewMode,
      onFormSubmit: this.#switchToViewMode});
    this.#pointComponent = new PointView({point, destinations, offers, onEditClick: this.#switchToEditMode, onToggleFavorite: this.#onFavoriteToggle});

    if (prevPointComponent === null || prevEditingPointFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    // Проверка на наличие в DOM
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editingPointFormComponent, prevEditingPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditingPointFormComponent);

  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editingPointFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editingPointFormComponent.reset(this.#point);
      this.#switchToViewMode();
    }
  }

  #switchToEditMode = () => {
    replace(this.#editingPointFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeydown);
    this.#onModeChange?.();
    this.#mode = Mode.EDITING;
  };

  #switchToViewMode = () => {
    replace(this.#pointComponent, this.#editingPointFormComponent);
    document.removeEventListener('keydown', this.#onEscapeKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscapeKeydown = (event) => {
    if (event.key === 'Escape') {
      this.#editingPointFormComponent.reset(this.#point);
      this.#switchToViewMode();
    }
  };

  #onFavoriteToggle = () => {
    this.#onPointChange?.({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
