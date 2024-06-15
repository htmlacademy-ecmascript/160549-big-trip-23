import {render, RenderPosition} from '../framework/render';
import SortingView from '../view/sorting-view';

import PointsListView from '../view/points-list-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import {FilterTypes} from '../constants';
import PointPresenter from './point-presenter';
import {updateItem} from '../utils/common';

export default class MainPresenter {
  #mainContainer = null;
  #pointsModel = null;

  #points = null;
  #destinations = null;
  #offers = null;

  #sortingComponent = new SortingView();
  #pointsListComponent = new PointsListView();

  #pointPresenters = new Map();

  constructor({mainContainer, pointsModel}) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#renderMain();
  }

  #renderPointsList() {
    this.#points.forEach((point) => this.#renderPoint({point}));
  }

  #renderPoint({point}) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onPointChange: this.#onPointChange,
      onModeChange: this.#onModeChange
    });

    pointPresenter.init(point, this.#destinations, this.#offers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new EmptyPointsListView({filter: FilterTypes.EVERYTHING}), this.#mainContainer);
  }

  #renderSorting() {
    render(this.#sortingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderMain() {
    render(this.#pointsListComponent, this.#mainContainer);

    if (!this.#points.length) {
      return this.#renderNoPoints();
    }

    this.#renderSorting();
    this.#renderPointsList();
  }

  #onPointChange = (point) => {
    this.#points = updateItem(this.#points, point);
    this.#pointPresenters.get(point.id).init(point, this.#destinations, this.#offers);
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
