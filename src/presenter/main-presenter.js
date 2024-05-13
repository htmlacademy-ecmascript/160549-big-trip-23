import {render} from '../render';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditingFormView from '../view/editing-form-view';
import PointsListView from '../view/points-list-view';
import CreationFormView from '../view/creation-form-view';

export default class MainPresenter {
  sortingComponent = new SortingView();
  eventsListComponent = new PointsListView();

  constructor({mainContainer, pointsModel}) {
    this.mainContainer = mainContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(this.sortingComponent, this.mainContainer);
    render(this.eventsListComponent, this.mainContainer);
    render(new EditingFormView(), this.eventsListComponent.getElement());
    render(new CreationFormView(), this.eventsListComponent.getElement());

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      render(new PointView({point: point, destination: this.pointsModel.getDestinationById(point.destination), offers: this.pointsModel.getOffersByPointType(point.type, point.offers)}), this.eventsListComponent.getElement());
    }
  }
}
