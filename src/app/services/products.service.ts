import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ProductsService {
  baseUrl = "http://192.168.1.4:51044/delivery-app/";

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return fetch(`${this.baseUrl}products?clientId=1`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getAllProductsByPriceAsc() {
    return fetch(`${this.baseUrl}products?searchQuery=asc`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getAllProductsByPriceDesc() {
    return fetch(`${this.baseUrl}products?searchQuery=desc`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getAllSearchedProducts(query) {
    return fetch(`${this.baseUrl}products?searchQuery=${query}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getProductsByCategoryId(categoryId: number) {
    return fetch(`${this.baseUrl}products/category?id=${categoryId}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  addToCart(prodId: number, cliId: number, prodAmount: string) {
    return fetch(`${this.baseUrl}cart/add`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: prodId,
        clientId: cliId,
        amount: prodAmount,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getCartProducts(userId: number) {
    return fetch(`${this.baseUrl}cart/products/clients/${userId}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  likeProduct(prodId: number, cliId: number) {
    return fetch(`${this.baseUrl}products/like-product`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: prodId,
        clientId: cliId,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  dislikeProduct(prodId: number, cliId: number) {
    return fetch(`${this.baseUrl}products/dislike-product`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: prodId,
        clientId: cliId,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  getFavoriteProducts(clientId: number) {
    return fetch(`${this.baseUrl}products/favorites/clients/${clientId}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
}
