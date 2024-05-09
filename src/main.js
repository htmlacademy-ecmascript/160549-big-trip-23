import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';

const headerContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter({headerContainer});
const generalPresenter = new MainPresenter({mainContainer});

headerPresenter.init();
generalPresenter.init();

