import AbstractView from '../framework/view/abstract-view.js';
function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createNewEventButtonTemplate();
  }
}
