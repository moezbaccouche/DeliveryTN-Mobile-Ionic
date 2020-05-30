import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  constructor(private http: HttpClient) {}

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
            data.dateOfBirth,
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

  updateClient(editedClient) {
    return this.http.post(`${this.baseUrl}clients/edit`, editedClient);
  }

  register(newClient) {
    return this.http.post(`${this.baseUrl}clients/register`, newClient);
  }

  login(clientCredentials) {
    return this.http.post(
      `${this.baseUrl}clients/loginClient`,
      clientCredentials
    );
  }

  resetPassword(email) {
    return this.http.post(`${this.baseUrl}clients/resetPassword`, email);
  }
}
