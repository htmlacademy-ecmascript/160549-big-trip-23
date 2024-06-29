import {remove, render, RenderPosition} from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

import PointsListView from '../view/points-list-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import SortingView from '../view/sorting-view';
import LoadingView from '../view/loading-view';
import FailedLoadDataView from '../view/failed-load-data-view';
import PointPresenter from './point-presenter';
import {FilterType, LoaderTimeLimit, SortType, UpdateType, UserAction} from '../constants';
import NewPointPresenter from './new-point-presenter';
import {sortPointsByType} from '../utils/point';
import {filter} from '../utils/filter';

export default class MainPresenter {
  #mainContainer = null;
  #newPointButton = null;
  #pointsModel = null;
  #filterModel = null;

  #activeSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingError = false;

  #sortingComponent = null;
  #emptyPointsListComponent = null;
  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #failedDataLoadingComponent = new FailedLoadDataView();
  #uiBlocker = new UiBlocker({
    lowerLimit: LoaderTimeLimit.LOWER_LIMIT,
    upperLimit: LoaderTimeLimit.UPPER_LIMIT,
  });

  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor({mainContainer, newPointButton, pointsModel, filterModel}) {
    this.#mainContainer = mainContainer;
    this.#newPointButton = newPointButton;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointButton.addEventListener('click', this.#handleAddNewPointButtonClick);

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      handlePointChange: this.#handleViewAction,
      handleDestroy: () => this.#onNewPointButtonToggleDisabled(false),
    });
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    return sortPointsByType(filteredPoints, this.#activeSortType);
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
    this.#emptyPointsListComponent = new EmptyPointsListView({filter: this.#filterModel.filter});
    render(this.#emptyPointsListComponent, this.#mainContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({sortType: this.#activeSortType, onSortTypeChange: this.#onSortTypeChange});
    render(this.#sortingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer);
  }

  #renderError() {
    render(this.#failedDataLoadingComponent, this.#mainContainer);
  }

  #renderMain() {
    render(this.#pointsListComponent, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderError();
      return;
    }

    if (!this.points.length) {
      return this.#renderNoPoints();
    }

    this.#renderSorting();
    this.#renderPointsList();
  }

  #clearMain({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#loadingComponent);

    if (this.#emptyPointsListComponent) {
      remove(this.#emptyPointsListComponent);
    }

    if (resetSortType) {
      this.#activeSortType = SortType.DAY;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetFilterType: true, resetSortType: true});
        this.#renderMain();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        if (!this.#isLoadingError) {
          this.#onNewPointButtonToggleDisabled(false);
        }
        remove(this.#loadingComponent);
        this.#renderMain();
        break;
      case UpdateType.ERROR:
        this.#isLoadingError = true;
        break;
    }
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
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

  #createPoint() {
    this.#activeSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    remove(this.#emptyPointsListComponent);
    this.#newPointPresenter.init(this.destinations, this.offers);
  }

  #onNewPointButtonToggleDisabled = (isDisabled) => {
    this.#newPointButton.disabled = isDisabled;
  };

  #handleAddNewPointButtonClick = () => {
    this.#createPoint();
    this.#onNewPointButtonToggleDisabled(true);
  };
}
