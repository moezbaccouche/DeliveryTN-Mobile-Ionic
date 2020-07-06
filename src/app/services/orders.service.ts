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
  baseUrl = "http://192.168.1.3:51044/delivery-app/";

  private deliveredOrders: any[] = [];
  private inDeliveryOrder: any;
  private notDeliveredOrder: any;

  private treatedOrders: any[] = [];
  treatedOrdersSubject = new Subject<any[]>();

  private clientOrders: any[] = [];
  clientOrdersSubject = new Subject<any[]>();

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

  emitClientOrdersSubject() {
    this.clientOrdersSubject.next(this.clientOrders.slice());
  }

  makeNewOrder(cliId, requestBill, distance) {
    return fetch(`${this.baseUrl}orders/add`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: cliId,
        withBill: requestBill,
        distance: distance,
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

  getClientOrders(clientId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}orders/all/clients/${clientId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.clientOrders = data;
          this.emitClientOrdersSubject();
          resolve("Commandes récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getOrderDetails(orderId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}orders/${orderId}`).then((response) => {
        resolve(response.json());
      }),
        (error) => {
          reject(error);
        };
    });
  }

  cancelPendingOrder(orderId) {
    return fetch(`${this.baseUrl}orders/cancelOrder`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
      .then((response: any) => {
        console.log(response);
        console.log(this.clientOrders);
        const index = this.clientOrders.findIndex((o) => {
          return o.orderId === response.orderId;
        });

        if (index !== -1) {
          this.clientOrders.splice(index, 1);
          this.emitClientOrdersSubject();
          console.log(this.clientOrders);
        }
      })
      .catch((error) => console.error(error));
  }
}
