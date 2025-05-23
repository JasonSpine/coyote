import {googleMapsLoaded} from "./googleMaps";

export class GoogleMapsPin implements LocationDisplay {
  mount(element: HTMLElement, latitude: number, longitude: number): void {
    googleMapsLoaded(() => this.mountAddress(element, latitude, longitude));
  }

  mountAddress(element: HTMLElement, latitude: number, longitude: number): void {
    const location = {lat: latitude, lng: longitude};
    const map = new google.maps.Map(element, {
      zoom: 12,
      center: location,
    });
    new google.maps.Marker({
      position: location,
      map: map,
    });
  }
}

export interface LocationDisplay {
  mount(element: HTMLElement, latitude: number, longitude: number): void;
}

export class TestLocationDisplay implements LocationDisplay {
  mount(element: HTMLElement, latitude: number, longitude: number): void {}
}
