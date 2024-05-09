import {render} from '../render';
import SortingView from '../view/sorting-view';
import EventItemView from '../view/event-item-view';
import EditingFormView from '../view/editing-form-view';
import EventsListView from '../view/events-list-view';
import CreationFormView from '../view/creation-form-view';

export default class MainPresenter {
  sortingComponent = new SortingView();
  eventsListComponent = new EventsListView();

  constructor({mainContainer}) {
    this.mainContainer = mainContainer;
  }

  init() {
    render(this.sortingComponent, this.mainContainer);
    render(this.eventsListComponent, this.mainContainer);
    render(new EditingFormView(), this.eventsListComponent.getElement());
    render(new CreationFormView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventItemView(), this.eventsListComponent.getElement());
    }
  }
}
