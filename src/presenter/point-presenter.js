import {render, replace, remove} from '../framework/render';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';
import {UpdateType, UserAction} from '../constants';
import {isMinorChanges} from '../utils/point';

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
      onPointDelete: this.#onPointDelete,
      onFormSubmit: this.#onFormSubmit
    });
    this.#pointComponent = new PointView({
      point,
      destinations,
      offers,
      onEditClick: this.#switchToEditMode,
      onToggleFavorite: this.#onFavoriteToggle
    });

    if (prevPointComponent === null || prevEditingPointFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    // Проверка на наличие в DOM
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditingPointFormComponent);
      this.#mode = Mode.DEFAULT;
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editingPointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editingPointFormComponent.shake(resetFormState);
  }

  #onEscapeKeydown = (event) => {
    if (event.key === 'Escape') {
      this.#editingPointFormComponent.reset(this.#point);
      this.#switchToViewMode();
    }
  };

  #onFavoriteToggle = () => {
    this.#onPointChange?.(UserAction.UPDATE_POINT, UpdateType.MINOR, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onPointDelete = () => {
    this.#onPointChange?.(UserAction.DELETE_POINT, UpdateType.MAJOR, {...this.#point});
  };

  #onFormSubmit = (point) => {
    const currentUpdateType = isMinorChanges(this.#point, point) ? UpdateType.MINOR : UpdateType.PATCH;

    this.#onPointChange?.(UserAction.UPDATE_POINT, currentUpdateType, point);
  };
}
