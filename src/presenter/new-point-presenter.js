import {render, remove, RenderPosition} from '../framework/render.js';
import {UpdateType, UserAction} from '../constants';
import EditingFormView from '../view/editing-form-view';

export default class NewPointPresenter {
  #pointListContainer = null;
  #editingFormComponent = null;

  #onPointChange = null;
  #onDestroy = null;

  constructor({ pointListContainer, handlePointChange, handleDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#onPointChange = handlePointChange;
    this.#onDestroy = handleDestroy;
  }

  init(destinations, offers) {
    if (this.#editingFormComponent !== null) {
      return;
    }

    this.#editingFormComponent = new EditingFormView({destinations, offers, onFormSubmit: this.#onFormSubmit, onFormClose: this.#onDelete});
    render(this.#editingFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointListContainer === null) {
      return;
    }

    this.#onDestroy?.();

    remove(this.#editingFormComponent);
    this.#editingFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editingFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editingFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editingFormComponent.shake(resetFormState);
  }

  #onFormSubmit = (point) => {
    this.#onPointChange?.(UserAction.ADD_POINT, UpdateType.MAJOR, point);
  };

  #onDelete = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
