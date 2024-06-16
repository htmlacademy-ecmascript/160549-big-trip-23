import {render, RenderPosition} from '../framework/render';
import SortingView from '../view/sorting-view';

import PointsListView from '../view/points-list-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import {FilterTypes, SortType} from '../constants';
import PointPresenter from './point-presenter';
import {updateItem} from '../utils/common';
import {sortPointsByType} from '../utils/point';

export default class MainPresenter {
  #mainContainer = null;
  #pointsModel = null;

  #points = null;
  #destinations = null;
  #offers = null;
  #activeSortType = SortType.DAY;

  #sortingComponent = null;
  #pointsListComponent = new PointsListView();

  #pointPresenters = new Map();

  constructor({mainContainer, pointsModel}) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = sortPointsByType(this.#pointsModel.points, this.#activeSortType);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#renderMain();
  }

  #renderPointsList() {
    this.#points.forEach((point) => this.#renderPoint({point}));
  }

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
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
    this.#sortingComponent = new SortingView({sortType: this.#activeSortType, onSortTypeChange: this.#onSortTypeChange});
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

  #onSortTypeChange = (value) => {
    if (this.#activeSortType === value) {
      return;
    }
    this.#sortPoints(value);
    this.#clearTaskList();
    this.#renderPointsList();
  };

  #sortPoints = (value) => {
    sortPointsByType(this.#points, value);
    this.#activeSortType = value;
  };
}
