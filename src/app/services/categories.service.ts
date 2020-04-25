import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  categories: any[] = [];
  categorySubject = new Subject<any[]>();

  baseUrl = "http://192.168.1.4:51044/delivery-app/";
  constructor(private http: HttpClient) {}

  emitCategorySubject() {
    this.categorySubject.next(this.categories.slice());
  }

  getAllCategoriesFromApi() {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}categories`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.categories = data;
          this.emitCategorySubject();
          resolve("Catégories récupérées avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  searchCategoriesFromApi(query: string) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}categories?searchQuery=${query}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.categories = data;
          this.emitCategorySubject();
          resolve("Catégories récupérées avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getCategoryByIdFromApi(id: number) {
    const category = this.categories.find((c) => {
      return c.id === id;
    });
    return category;
  }
}
