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
}
