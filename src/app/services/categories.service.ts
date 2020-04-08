import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  baseUrl = "http://192.168.1.3:51044/delivery-app/";
  constructor(private http: HttpClient) {}

  getAllCategories() {
    return fetch(`${this.baseUrl}categories`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  searchCategories(query) {
    return fetch(`${this.baseUrl}categories?searchQuery=${query}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getCategoryById(id: number) {
    return fetch(`${this.baseUrl}categories/${id}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
}
