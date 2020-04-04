import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ProductsService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return fetch(`${this.baseUrl}products`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
}
