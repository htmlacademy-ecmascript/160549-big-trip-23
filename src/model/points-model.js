import {mockPoints} from '../mock/points';
import {mockDestinations} from '../mock/destinations';
import {mockOffers} from '../mock/offers';

export default class PointsModel {
  #points = [...mockPoints];
  #destinations = [...mockDestinations];
  #offers = [...mockOffers];

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
