export class GoogleMapsAddressProvider implements AddressProvider {
  mount(element: HTMLElement, latitude: number, longitude: number): void {
    window.onGoogleMapsLoaded(() => this.mountAddress(element, latitude, longitude));
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

export interface AddressProvider {
  mount(element: HTMLElement, latitude: number, longitude: number): void;
}

export class TestAddressProvider implements AddressProvider {
  mount(element: HTMLElement, latitude: number, longitude: number): void {}
}
