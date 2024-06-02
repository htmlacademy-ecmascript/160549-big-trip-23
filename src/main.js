import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';
import PointsModel from './model/points-model';

const headerContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const headerPresenter = new HeaderPresenter({headerContainer});
const generalPresenter = new MainPresenter({mainContainer, pointsModel});

headerPresenter.init();
generalPresenter.init();

