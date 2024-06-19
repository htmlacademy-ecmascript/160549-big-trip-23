import {remove, render, RenderPosition} from '../framework/render';
import SortingView from '../view/sorting-view';

import PointsListView from '../view/points-list-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import {FilterType, SortType, UpdateType, UserAction} from '../constants';
import PointPresenter from './point-presenter';
import {sortPointsByType} from '../utils/point';

export default class MainPresenter {
  #mainContainer = null;
  #pointsModel = null;

  #activeSortType = SortType.DAY;

  #sortingComponent = null;
  #emptyPointsListComponent = null;
  #pointsListComponent = new PointsListView();

  #pointPresenters = new Map();

  constructor({mainContainer, pointsModel}) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return sortPointsByType(this.#pointsModel.points, this.#activeSortType);
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderMain();
  }

  #renderPointsList() {
    this.points.forEach((point) => this.#renderPoint({point}));
  }


  #renderPoint({point}) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange
    });

    pointPresenter.init(point, this.destinations, this.offers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    this.#emptyPointsListComponent = new EmptyPointsListView({filter: FilterType.EVERYTHING});
    render(this.#emptyPointsListComponent, this.#mainContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({sortType: this.#activeSortType, onSortTypeChange: this.#onSortTypeChange});
    render(this.#sortingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderMain() {
    render(this.#pointsListComponent, this.#mainContainer);

    if (!this.points.length) {
      return this.#renderNoPoints();
    }

    this.#renderSorting();
    this.#renderPointsList();
  }

  #clearMain({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#emptyPointsListComponent);

    if (resetSortType) {
      this.#activeSortType = SortType.DAY;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain();
        this.#renderMain();
        break;
    }
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortTypeChange = (value) => {
    if (this.#activeSortType === value) {
      return;
    }
    this.#sortPoints(value);
    this.#clearMain();
    this.#renderMain();
  };

  #sortPoints = (value) => {
    sortPointsByType(this.points, value);
    this.#activeSortType = value;
  };
}
