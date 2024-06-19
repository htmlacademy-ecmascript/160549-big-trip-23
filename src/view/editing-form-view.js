import {getFullDateTime} from '../utils/formatDate';
import {makeFirstLetterInUpperCase} from '../utils/makeFirstLetterInUpperCase';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEventTypeItem({id, type, isChecked = false}) {
  return `
      <div class="event__type-item">
        <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" ${isChecked && 'checked'} name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${makeFirstLetterInUpperCase(type)}</label>
      </div>
  `;
}

function createDestinationOption(name) {
  return `<option value="${name}"></option>`;
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
function createCreationFormTemplate(point, allDestinations, allOffers) {
  const {id, basePrice, type, dateFrom, dateTo, typeOffers, destination} = point;
  const {name: destinationName = '', description: destinationDescription = '', pictures} = destination;

  const pointId = id || '0';

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
                ${allOffers.map((offer) => createEventTypeItem({id: pointId, type: offer.type, isChecked: offer.type === type})).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${allDestinations.map(({name}) => createDestinationOption(name)).join('')}
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
      ${typeOffers.length ?
      (`<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${typeOffers.map((offer) => createOfferSelector(offer, point.offers.includes(offer.id))).join('')}
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

export default class EditingFormView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #datepicker = null;
  #handleClose = null;
  #handleSubmit = null;

  constructor({point, destinations, offers, onFormClose, onFormSubmit}) {
    super();
    this._setState(EditingFormView.parsePointToState(point, destinations, offers));

    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleClose = onFormClose;
    this.#handleSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createCreationFormTemplate(this._state, this.#destinations, this.#offers);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#onSubmit);
    this.element.querySelector('fieldset').addEventListener('change', this.#onPointTypeChange);
    this.element.querySelector('.event__input').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClose);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onClose);

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  removeElement() {
    super.removeElement();
    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point) {
    this.updateElement(EditingFormView.parsePointToState(point));
  }

  #onClose = (event) => {
    event.preventDefault();
    this.#handleClose?.();
  };

  #onSubmit = (event) => {
    event.preventDefault();
    this.#handleSubmit?.(EditingFormView.parseStateToPoint(this._state));
  };

  #onPointTypeChange = (event) => {
    event.preventDefault();
    const pointType = event.target.value;

    this.updateElement({
      type: event.target.value,
      typeOffers: this.#offers.find((offer) => offer.type === pointType)?.offers || []
    });
  };

  #onDestinationChange = (event) => {
    event.preventDefault();
    const destinationName = event.target.value;

    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === destinationName) || {}
    });
  };

  #onDateFromChange = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom.toISOString(),
    });
  };

  #onDateToChange = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo.toISOString(),
    });
  };

  #setDatepickerFrom = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFrom: this._state.dateFrom,
        dateFormat: 'd/m/y h:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this.#onDateFromChange,
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        minDate: this._state.dateFrom,
        dateFrom: this._state.dateTo,
        dateFormat: 'd/m/y h:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this.#onDateToChange,
      }
    );
  };

  static parsePointToState(point, destinations, offers) {
    return {
      ...point,
      destination: destinations.find((destination) => destination.id === point.destination) || {},
      typeOffers: offers.find((offer) => offer.type === point.type)?.offers || [],
    };
  }

  static parseStateToPoint(state) {
    state.destination = state.destination.id;

    delete state.typeOffers;

    return state;
  }
}
