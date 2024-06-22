import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const headerContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const headerPresenter = new HeaderPresenter({headerContainer});
const filtersPresenter = new FiltersPresenter({filterContainer, filterModel, pointsModel});
const generalPresenter = new MainPresenter({
  mainContainer: tripEventsContainer,
  newPointButton: addNewPointButton,
  pointsModel,
  filterModel
});

headerPresenter.init();
filtersPresenter.init();
generalPresenter.init();

