import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  baseUrl = "http://192.168.1.4:51044/delivery-app/";

  private allProducts: Product[] = [];
  private cartProducts: Product[] = [];
  private cartProductsCategories: any[] = [];
  private favoriteProducts: Product[] = [];

  productSubject = new Subject<Product[]>();
  cartProductSubject = new Subject<Product[]>();
  favoriteProductsSubject = new Subject<Product[]>();
  cartProductsCategoriesSubject = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  getProductsByCategoryId(categoryId: number) {
    return fetch(`${this.baseUrl}products/category?id=${categoryId}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  emitProductsSubject() {
    this.productSubject.next(this.allProducts.slice());
  }

  emitCartProductsSubject() {
    this.cartProductSubject.next(this.cartProducts.slice());
  }

  emitFavoriteProductsSubject() {
    this.favoriteProductsSubject.next(this.favoriteProducts.slice());
  }

  emitCartProductsCategoriesSubject() {
    this.cartProductsCategoriesSubject.next(
      this.cartProductsCategories.slice()
    );
  }

  getProductsFromApi() {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}products?clientId=1`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.allProducts = data;
          this.emitProductsSubject();
          resolve("Produits récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getProductById(id: number): Product {
    const product = this.allProducts.find((p) => {
      return p.id === id;
    });
    return product;
  }

  getAllProductsByPriceAscFromApi() {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}products?searchQuery=asc`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.allProducts = data;
          this.emitProductsSubject();
          resolve("Produits récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getAllProductsByPriceDescFromApi() {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}products?searchQuery=desc`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.allProducts = data;
          this.emitProductsSubject();
          resolve("Produits récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getAllSearchedProductsFromApi(query) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}products?searchQuery=${query}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.allProducts = data;
          this.emitProductsSubject();
          resolve("Produits récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  /* -------------------------   Cart Products Methods ------------------------- */

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
      .then((response) => {
        let product = this.getProductById(prodId);
        this.cartProducts.push(product);
        this.emitCartProductsSubject();
      })
      .catch((error) => console.error(error));
  }

  deleteProductFromCart(prodId: number, cliId: number, categoryId: string) {
    return fetch(`${this.baseUrl}cart/delete`, {
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
      .then((response) => {
        const prodIndex = this.cartProducts.findIndex((p) => p.id === prodId);
        if (prodIndex !== -1) {
          this.cartProducts = this.cartProducts.filter(
            (item, index) => index !== prodIndex
          );

          //Search for the specific category in the cartProductsCategories array
          const categoryIndex = this.cartProductsCategories.findIndex(
            (c) => c.id == categoryId
          );
          if (categoryIndex !== -1) {
            //Decrement NbProducts of the category in the cartProductsCategories array
            this.cartProductsCategories[categoryIndex].nbProducts--;

            const nbProducts = this.cartProductsCategories[categoryIndex]
              .nbProducts;

            //If nbProducts of the category becomes 0 then we delete the object from the array
            if (nbProducts == 0) {
              this.cartProductsCategories.splice(categoryIndex, 1);
            }
          }
        }
        this.emitCartProductsSubject();
        this.emitCartProductsCategoriesSubject();
      })
      .catch((error) => console.error(error));
  }

  getCartProductsFromApi(userId: number) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}cart/products/clients/${userId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.cartProducts = data.products;
          this.cartProductsCategories = data.categories;
          this.emitCartProductsSubject();
          this.emitCartProductsCategoriesSubject();
          resolve(data);
        }),
        (error) => {
          reject(error);
        };
    });
  }

  removeAllCartProducts(cliId) {
    return fetch(`${this.baseUrl}cart/deleteAll`, {
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
        this.cartProducts = [];
        this.cartProductsCategories = [];
        this.emitCartProductsSubject();
        this.emitCartProductsCategoriesSubject();
      })
      .catch((error) => console.error(error));
  }

  /* -------------------------   Favorite Products Methods ------------------------- */

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
      .then((response) => {
        let product = this.getProductById(prodId);
        this.favoriteProducts.push(product);

        //The following lines are not done correctly
        //The logic must be changed
        //Setting "isLiked" inside the product object is a bad idea

        const favProductAllProducts = this.allProducts.findIndex((p) => {
          return p.id === prodId;
        });

        if (favProductAllProducts !== -1) {
          this.allProducts[favProductAllProducts].isFavorite = true;
        }
        this.emitProductsSubject();

        this.emitFavoriteProductsSubject();
      })
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
      .then((response) => {
        const prodIndex = this.favoriteProducts.findIndex((p) => {
          return p.id === prodId;
        });

        if (prodIndex !== -1) {
          this.favoriteProducts.splice(prodIndex, 1);
        }

        //The following lines are not done correctly
        //The logic must be changed
        //Setting "isLiked" inside the product object is a bad idea

        const favProductAllProducts = this.allProducts.findIndex((p) => {
          return p.id === prodId;
        });

        if (favProductAllProducts !== -1) {
          this.allProducts[favProductAllProducts].isFavorite = false;
        }
        this.emitProductsSubject();

        this.emitFavoriteProductsSubject();
      })
      .catch((error) => console.error(error));
  }

  getFavoriteProductsFromApi(clientId: number) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}products/favorites/clients/${clientId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.favoriteProducts = data;
          this.emitFavoriteProductsSubject();
          resolve("Produits favoris récupérés avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }
}
