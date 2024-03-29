import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { resolve } from "url";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class DeliveryMenService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";

  constructor(private http: HttpClient) {}

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

  rateDeliveryMan(cliId, deliveryManId, nbStars) {
    return fetch(`${this.baseUrl}deliveryMen/addRating`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idClient: cliId,
        idDeliveryMan: deliveryManId,
        rate: nbStars,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.error(error));
  }

  editDeliveryManRating(cliId, deliveryManId, nbStars) {
    return fetch(`${this.baseUrl}deliveryMen/editRating`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idClient: cliId,
        idDeliveryMan: deliveryManId,
        rate: nbStars,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.error(error));
  }

  getAllDeliveryMenPlayersIds() {
    return this.http.get(`${this.baseUrl}deliveryMen/playersIds`);
  }
}
