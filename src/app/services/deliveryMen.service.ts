import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class DeliveryMenService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";

  constructor() {}

  getDeliveryManById(deliveryManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}deliveryMen/${deliveryManId}`).then((response) => {
        resolve(response.json());
      }),
        (error) => {
          reject(error);
        };
    });
  }
}
