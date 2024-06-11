import {render} from '../framework/render';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';
import PointsListView from '../view/points-list-view';
import {DEFAULT_POINT} from '../constants';

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
    render(new EditingFormView({point: DEFAULT_POINT, destinations, offers}), this.#pointsListComponent.element);
    render(new EditingFormView({point: points[0], destinations, offers}), this.#pointsListComponent.element);

    points.forEach((point) => this.#renderTask({point, destinations, offers}));
  }

  #renderTask({point, destinations, offers}) {
    const pointComponent = new PointView({point, destinations, offers});
    render(pointComponent, this.#pointsListComponent.element);
  }
}
