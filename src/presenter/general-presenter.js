import {render, RenderPosition} from '../render';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import EventItemView from '../view/event-item-view';
import EditingFormView from '../view/editing-form-view';

export default class GeneralPresenter {
  constructor() {
    this.tripControlsFilters = document.querySelector('.trip-controls__filters');
    this.tripEvents = document.querySelector('.trip-events');

    this.tripEventsList = document.createElement('ul');
    this.tripEventsList.classList.add('trip-events__list');
    this.tripEvents.append(this.tripEventsList);
  }

  renderFilters() {
    render(new FiltersView(), this.tripControlsFilters);
  }

  renderSorting() {
    render(new SortingView(), this.tripEvents, RenderPosition.AFTERBEGIN);
  }

  renderEditingForm() {
    render(new EditingFormView(), this.tripEventsList);
  }

  renderEvents() {
    for (let i = 0; i < 3; i++) {
      render(new EventItemView(), this.tripEventsList);
    }
  }

  init() {
    this.renderFilters();
    this.renderSorting();
    this.renderEditingForm();
    this.renderEvents();
  }
}
