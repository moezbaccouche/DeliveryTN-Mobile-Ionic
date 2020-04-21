import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  baseUrl = "http://192.168.1.4:51044/delivery-app/";

  private deliveredOrders: any[];
  private inDeliveryOrder: any;
  private notDeliveredOrder: any;

  private treatedOrders: any[];
  treatedOrdersSubject = new Subject<any[]>();

  emitTreatedOrdersSubject() {
    this.treatedOrdersSubject.next(this.treatedOrders.slice());
  }

  deliveredOrdersSubject = new Subject<any[]>();
  inDeliveryOrderSubject = new Subject<any>();
  notDeliveredOrderSubject = new Subject<any>();

  emitDeliveredOrdersSubject() {
    this.deliveredOrdersSubject.next(this.deliveredOrders.slice());
  }

  emitInDeliveryOrdersSubject() {
    this.inDeliveryOrderSubject.next(this.inDeliveryOrder);
  }

  emitNotDeliveredOrderSubject() {
    this.notDeliveredOrderSubject.next(this.notDeliveredOrder);
  }

  makeNewOrder(cliId) {
    return fetch(`${this.baseUrl}orders/add`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: cliId,
      }),
    })
      .then((response) => {
        this.notDeliveredOrder = response;
        this.emitNotDeliveredOrderSubject();
      })
      .catch((error) => console.error(error));
  }

  getPendingOrder(cliId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}orders/notDelivered/${cliId}`).then((response) => {
        resolve(response.json());
      }),
        (error) => {
          reject(error);
        };
    });
  }

  getTreatedOrders(clientId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}orders/clients/${clientId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.treatedOrders = data;
          this.emitTreatedOrdersSubject();
          resolve("Commandes récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }
}
