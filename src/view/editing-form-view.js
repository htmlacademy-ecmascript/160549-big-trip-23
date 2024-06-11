import {getFullDateTime} from '../utils/formatDate';
import {makeFirstLetterInUpperCase} from '../utils/makeFirstLetterInUpperCase';
import AbstractView from '../framework/view/abstract-view';

function createEventTypeItem({id, type, isChecked = false}) {
  return `
      <div class="event__type-item">
        <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" ${isChecked && 'checked'} name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${makeFirstLetterInUpperCase(type)}</label>
      </div>
  `;
}

function createDestinationOption(value) {
  return `<option value="${value}"></option>`;
}

function createDestinationPicture(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

function createOfferSelector(offer, isChecked = false) {
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked && 'checked'}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
}
function createCreationFormTemplate(point, destinations, offers) {
  const {basePrice, type, dateFrom, dateTo} = point;
  const pointTypeOffers = offers.find((offer) => offer.type === type).offers;
  const pointId = point.id || '0';

  const pointDestination = destinations.find((destination) => destination.id === point.destination) || {};
  const {name: destinationName = '', description: destinationDescription = '', pictures} = pointDestination;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${offers.map((offer) => createEventTypeItem({id: pointId, type: offer.type, isChecked: offer.type === type})).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${destinations.map((destination) => createDestinationOption(destination.name)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${getFullDateTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${getFullDateTime(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${point.id ? 'Delete' : 'Cancel'}</button>
      ${point.id ?
      (`<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`)
      : ''}
        </header>
        <section class="event__details">
      ${pointTypeOffers ?
      (`<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${pointTypeOffers.map((offer) => createOfferSelector(offer, point.offers.includes(offer.id))).join('')}
          </div>
        </section>`)
      : ''}

      ${destinationDescription ?
      (`<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationDescription}</p>

        ${pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures.map((picture) => createDestinationPicture(picture)).join('')}
          </div>
        </div>
        ` : ''}
      </section>`
      ) : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditingFormView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleClose = null;
  #handleSubmit = null;

  #rollupButton = null;
  #resetButton = null;

  constructor({point, destinations, offers, onFormClose, onFormSubmit}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleClose = onFormClose;
    this.#handleSubmit = onFormSubmit;

    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#resetButton = this.element.querySelector('.event__reset-btn');

    this.element.addEventListener('submit', this.#onSubmit);
    this.#rollupButton.addEventListener('click', this.#onClose);
    this.#resetButton.addEventListener('click', this.#onClose);
  }

  get template() {
    return createCreationFormTemplate(this.#point, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    this.element.removeEventListener('submit', this.#onSubmit);
    this.#rollupButton.removeEventListener('click', this.#onClose);
    this.#resetButton.removeEventListener('click', this.#onClose);
  }

  #onClose = (event) => {
    event.preventDefault();
    this.#handleClose?.();
  };

  #onSubmit = (event) => {
    event.preventDefault();
    this.#handleSubmit?.();
  };
}
