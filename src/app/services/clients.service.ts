import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { Product } from "../models/product.model";
import { Client } from "../models/client.model";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";

  private client: Client;

  clientSubject = new Subject<Client>();

  emitClientSubject() {
    this.clientSubject.next(this.client);
  }

  getClient(cliId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}clients/${cliId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.client = new Client(
            data.id,
            data.firstName,
            data.lastName,
            data.phone,
            data.email,
            data.imageBase64,
            data.location
          );
          this.emitClientSubject();
          resolve("Client récupéré avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }
}
