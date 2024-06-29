import Observable from '../framework/observable';
import {UpdateType} from '../constants';

export default class PointsModel extends Observable {
  #pointsApiService = null;

  #points = [];
  #destinations = [];
  #offers = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);

      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
    } catch (error) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(type, updatedPoint) {
    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = this.#points.map((point) => {
        if (point.id === adaptedPoint.id) {
          return adaptedPoint;
        }
        return point;
      });

      this._notify(type, adaptedPoint);
    } catch (e) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(type, newPoint) {
    try {
      const response = await this.#pointsApiService.addPoint(newPoint);
      const adaptedNewPoint = this.#adaptToClient(response);
      this.#points = [...this.#points, adaptedNewPoint];

      this._notify(type, adaptedNewPoint);
    } catch (e) {
      throw new Error('Can\'t update point');
    }

  }

  async deletePoint(type, deletedPoint) {
    try {
      await this.#pointsApiService.deletePoint(deletedPoint);
      this.#points = this.#points.filter((point) => point.id !== deletedPoint.id);

      this._notify(type);
    } catch (e) {
      throw new Error('Can\'t update point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: Number(point['base_price']),
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
