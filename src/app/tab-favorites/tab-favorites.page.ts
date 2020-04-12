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
  clientId = 1;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.productsService
      .getFavoriteProducts(this.clientId)
      .then((data) => (this.favoriteProducts = data))
      .catch((error) => console.error(error));
  }
}
