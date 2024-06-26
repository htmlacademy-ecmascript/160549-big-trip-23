import he from 'he';
import {getDurationTime, getTime, getDayMonth, getFullDate} from '../utils/formatDate';
import AbstractView from '../framework/view/abstract-view';

function createPointTemplate(point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = point;

  const pointDate = getDayMonth(dateFrom);
  const duration = getDurationTime(dateFrom, dateTo);
  const [timeFrom, timeTo] = [getTime(dateFrom), getTime(dateTo)];

  const currentTypeOffers = offers.find((offer) => offer.type === type)?.offers;
  const pointOffersIds = new Set(point.offers);
  const pointOffers = currentTypeOffers.filter((offer) => pointOffersIds.has(offer.id));

  const pointDestination = destinations.find((destination) => destination.id === point.destination) || {};
  const {name = ''} = pointDestination;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getFullDate(dateFrom)}">${pointDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${he.encode(name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${pointOffers.map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #rollupButton = null;
  #favoriteButton = null;
  #handleTogglePoint = null;

  constructor({point, destinations, offers, onEditClick, onToggleFavorite}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleTogglePoint = onToggleFavorite;

    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');

    this.#rollupButton.addEventListener('click', this.#onClick);
    this.#favoriteButton.addEventListener('click', this.#onToggleFavorite);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    this.#rollupButton.removeEventListener('click', this.#onClick);
    this.#favoriteButton.removeEventListener('click', this.#onToggleFavorite);
  }

  #onClick = (event) => {
    event.preventDefault();
    this.#handleEditClick?.();
  };

  #onToggleFavorite = () => {
    this.#handleTogglePoint?.();
  };
}
