import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { resolve } from "url";
@Injectable({
  providedIn: "root",
})
export class DeliveryInfosService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";

  constructor() {}

  getOrderDeliveryInfos(orderId: number) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}deliveryInfos/orders/${orderId}`).then(
        (response) => {
          resolve(response.json());
        }
      ),
        (error) => {
          reject(error);
        };
    });
  }

  getRoute(coordinates, accessToken) {
    var url =
      "https://api.mapbox.com/directions/v5/mapbox/driving/" +
      coordinates +
      "?geometries=geojson&steps=true&access_token=" +
      accessToken;

    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        resolve(response.json());
      }),
        (error) => {
          reject(error);
        };
    });
  }

  getDeliveryManCurrentLocation(deliveryManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}deliveryInfos/location/${deliveryManId}`).then(
        (response) => {
          resolve(response.json());
        }
      ),
        (error) => {
          reject(error);
        };
    });
  }
}
