import {render, replace} from '../framework/render';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';
import PointsListView from '../view/points-list-view';

export default class MainPresenter {
  #mainContainer = null;
  #pointsModel = null;

  #sortingComponent = new SortingView();
  #pointsListComponent = new PointsListView();

  constructor({mainContainer, pointsModel}) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = [...this.#pointsModel.points];
    const destinations = [...this.#pointsModel.destinations];
    const offers = [...this.#pointsModel.offers];

    render(this.#sortingComponent, this.#mainContainer);
    render(this.#pointsListComponent, this.#mainContainer);

    points.forEach((point) => this.#renderTask({point, destinations, offers}));
  }

  #renderTask({point, destinations, offers}) {
    const onEditClick = () => switchToEditMode();
    const onFormClose = () => switchToViewMode();
    const onFormSubmit = () => switchToViewMode();
    const onEscapeKeydown = (event) => {
      if (event.key === 'Escape') {
        switchToViewMode();
      }
    };

    const pointComponent = new PointView({point, destinations, offers, onEditClick});
    const editingFormComponent = new EditingFormView({point, destinations, offers, onFormClose, onFormSubmit});

    function switchToEditMode() {
      replace(editingFormComponent, pointComponent);
      document.addEventListener('keydown', onEscapeKeydown);
    }

    function switchToViewMode() {
      replace(pointComponent, editingFormComponent);
      document.removeEventListener('keydown', onEscapeKeydown);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }
}
