import { Component } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  private allProducts = [];
  constructor(
    private domSanitizer: DomSanitizer,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this._loadAllProducts();
  }

  _loadAllProducts() {
    this.productsService.getAllProducts().then((data) => {
      this.allProducts = data;
    });
  }
}
