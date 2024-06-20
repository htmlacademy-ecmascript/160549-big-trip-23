import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FiltersPresenter from './presenter/filters-presenter';
import NewPointButtonPresenter from './presenter/new-point-button-presenter';

const headerContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const headerPresenter = new HeaderPresenter({headerContainer});
const filtersPresenter = new FiltersPresenter({filterContainer, filterModel, pointsModel});
const newPointButtonPresenter = new NewPointButtonPresenter({headerContainer});
const generalPresenter = new MainPresenter({mainContainer: tripEventsContainer, pointsModel, filterModel});

headerPresenter.init();
filtersPresenter.init();
newPointButtonPresenter.init();
generalPresenter.init();

