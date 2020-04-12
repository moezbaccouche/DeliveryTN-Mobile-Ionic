import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  cartProducts = [];
  cartCategories = [];
  userId = 1;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.productsService
      .getCartProducts(this.userId)
      .then(
        (data) => (
          (this.cartProducts = data.products),
          (this.cartCategories = data.categories)
        )
      )
      .catch((error) => console.error(error));
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cartProducts = [];
  }
}
