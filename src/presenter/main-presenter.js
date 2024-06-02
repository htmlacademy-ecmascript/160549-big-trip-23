import {render} from '../render';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';
import PointsListView from '../view/points-list-view';
import {defaultPoint} from '../constants';

export default class MainPresenter {
  sortingComponent = new SortingView();
  eventsListComponent = new PointsListView();

  constructor({mainContainer, pointsModel}) {
    this.mainContainer = mainContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = [...this.pointsModel.getPoints()];
    const destinations = [...this.pointsModel.getDestinations()];
    const offers = [...this.pointsModel.getOffers()];

    render(this.sortingComponent, this.mainContainer);
    render(this.eventsListComponent, this.mainContainer);
    render(new EditingFormView({point: defaultPoint, destinations, offers}), this.eventsListComponent.getElement());
    render(new EditingFormView({point: points[0], destinations, offers}), this.eventsListComponent.getElement());

    for (let i = 1; i < points.length; i++) {
      render(new PointView({point: points[i], destinations, offers}), this.eventsListComponent.getElement());
    }
  }
}
