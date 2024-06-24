import {getFullDateTime} from '../utils/formatDate';
import {makeFirstLetterInUpperCase} from '../utils/makeFirstLetterInUpperCase';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {DateFormat, DEFAULT_POINT} from '../constants';
import {getIsCheckedAttribute, getIsDisabledAttribute} from '../utils/common';

function createEventTypeItem({id, type, checked, disabled}) {
  return `
      <div class="event__type-item">
        <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" ${checked} ${disabled} name="event-type" value="${type}">
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

function createOfferSelector({offer, checked, disabled}) {
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" data-offer-id="${offer.id}" type="checkbox" name="event-offer-luggage" ${checked} ${disabled}>
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
}
function createCreationFormTemplate(point, destinations, offers) {
  const {id, basePrice, type, dateFrom, dateTo, isDisabled, isSaving, isDeleting} = point;

  const pointDestination = destinations.find((destination) => destination.id === point.destination) || {};
  const typeOffers = offers.find((offer) => offer.type === point.type)?.offers || [];

  const {name: destinationName = '', description: destinationDescription = '', pictures} = pointDestination;

  const pointId = id || '0';

  const saveStatusText = isSaving ? 'Saving...' : 'Save';
  const deleteStatusText = isDeleting ? 'Deleting...' : 'Delete';
  const disabled = getIsDisabledAttribute(isDisabled);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${pointId}" ${disabled} type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group" ${disabled}>
                <legend class="visually-hidden">Event type</legend>
                ${offers.map((offer) => createEventTypeItem({id: pointId, type: offer.type, checked: getIsCheckedAttribute(offer.type === type), disabled})).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${he.encode(destinationName)}" ${disabled} list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${destinations.map(({name}) => createDestinationOption(name)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${getFullDateTime(dateFrom)}" ${disabled}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${getFullDateTime(dateTo)}" ${disabled}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${he.encode(basePrice.toString())}" ${disabled}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${saveStatusText}</button>
          <button class="event__reset-btn" type="reset" ${disabled}>${point.id ? deleteStatusText : 'Cancel'}</button>
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
            ${typeOffers.map((offer) => createOfferSelector({offer, checked: getIsCheckedAttribute(point.offers.includes(offer.id)), disabled})).join('')}
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
  #handleFormClose = null;
  #handleFormSubmit = null;
  #handlePointDelete = null;

  constructor({point = DEFAULT_POINT, destinations, offers, onFormClose, onPointDelete, onFormSubmit}) {
    super();
    this._setState(EditingFormView.parsePointToState(point, destinations, offers));

    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormClose = onFormClose;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlePointDelete = onPointDelete;

    this._restoreHandlers();
  }

  get template() {
    return createCreationFormTemplate(this._state, this.#destinations, this.#offers);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('fieldset').addEventListener('change', this.#onPointTypeChange);
    this.element.querySelector('.event__input').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#onOffersChange);

    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onFormClose);
    this.element.querySelector('.event__reset-btn')?.addEventListener('click', this._state.id ? this.#onPointDelete : this.#onFormClose);

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

  #onFormClose = (event) => {
    event.preventDefault();
    this.#handleFormClose?.();
  };

  #onPointDelete = (event) => {
    event.preventDefault();
    this.#handlePointDelete?.();
  };

  #onFormSubmit = (event) => {
    event.preventDefault();
    this.#handleFormSubmit?.(EditingFormView.parseStateToPoint(this._state));
  };

  #onPointTypeChange = (event) => {
    event.preventDefault();

    this.updateElement({
      type: event.target.value,
      offers: [],
    });
  };

  #onOffersChange = (event) => {
    const { dataset: { offerId }, checked } = event.target;

    const offers = checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((existingOfferId) => existingOfferId !== offerId);

    this.updateElement({
      offers,
    });
  };

  #onPriceChange = (event) => {
    event.preventDefault();

    this._setState({basePrice: Number(event.target.value)});
  };

  #onDestinationChange = (event) => {
    event.preventDefault();
    const destinationName = event.target.value;
    const destination = this.#destinations.find((pointDestination) => pointDestination.name === destinationName);
    const destinationId = destination ? destination.id : null;

    this.updateElement({
      destination: destinationId,
    });
  };

  #onDateFromChange = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #onDateToChange = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };

  #setDatepickerFrom = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        dateFormat: DateFormat.RANGE_DATE,
        enableTime: true,
        'time_24hr': true,
        onClose: this.#onDateFromChange,
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        dateFormat: DateFormat.RANGE_DATE,
        enableTime: true,
        'time_24hr': true,
        onClose: this.#onDateToChange,
      }
    );
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return {...state};
  }
}
