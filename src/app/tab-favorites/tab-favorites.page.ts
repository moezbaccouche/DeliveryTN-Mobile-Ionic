import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tab-favorites",
  templateUrl: "./tab-favorites.page.html",
  styleUrls: ["./tab-favorites.page.scss"],
})
export class TabFavoritesPage implements OnInit {
  favoriteProducts = [];
  nbFavoriteProducts = 0;
  clientId = 2;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.productsService
      .getFavoriteProducts(this.clientId)
      .then(
        (data) => (
          (this.favoriteProducts = data),
          (this.nbFavoriteProducts = this.favoriteProducts.length),
          console.log("NOMBRE: " + this.nbFavoriteProducts)
        )
      )
      .catch((error) => console.error(error));
  }
}
