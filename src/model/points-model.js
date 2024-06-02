import {mockPoints} from '../mock/points';
import {mockDestinations} from '../mock/destinations';
import {mockOffers} from '../mock/offers';

export default class PointsModel {
  points = [...mockPoints];
  destinations = [...mockDestinations];
  offers = [...mockOffers];

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getOffersByPointType(type, offers) {
    const currentTypeOffers = this.offers.find((offer) => offer.type === type)?.offers;
    const pointOffers = new Set(offers);
    return currentTypeOffers.filter((offer) => pointOffers.has(offer.id));
  }
}
