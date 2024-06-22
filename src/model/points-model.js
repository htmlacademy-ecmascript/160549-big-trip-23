import {mockPoints} from '../mock/points';
import {mockDestinations} from '../mock/destinations';
import {mockOffers} from '../mock/offers';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {
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

  updatePoint(type, updatedPoint) {
    this.#points = this.#points.map((point) => {
      if (point.id === updatedPoint.id) {
        return updatedPoint;
      }
      return point;
    });

    this._notify(type, updatedPoint);
  }

  addPoint(type, updatedPoint) {
    this.#points = [
      updatedPoint,
      ...this.#points,
    ];

    this._notify(type, updatedPoint);
  }

  deletePoint(type, updatedPoint) {
    this.#points = this.#points.filter((point) => point.id !== updatedPoint.id);

    this._notify(type);
  }
}
