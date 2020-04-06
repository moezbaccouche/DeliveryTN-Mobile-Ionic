import { Component } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverController } from "@ionic/angular";
import { PopoverOrderbyComponent } from "../menus/popover-orderby/popover-orderby.component";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  allProducts: any;
  searchTerm: string;
  constructor(
    private domSanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    this._loadAllProducts();
  }

  _loadAllProducts() {
    this.productsService.getAllProducts().then((data) => {
      this.allProducts = data;
    });
  }

  _loadProductsByPriceAsc() {
    this.productsService.getAllProductsByPriceAsc().then((data) => {
      this.allProducts = data;
    });
  }

  _loadProductsByPriceDesc() {
    this.productsService.getAllProductsByPriceDesc().then((data) => {
      this.allProducts = data;
    });
  }

  _loadProductsByCriteria(criteria) {
    switch (criteria) {
      case "asc":
        this._loadProductsByPriceAsc();
        break;
      case "desc":
        this._loadProductsByPriceDesc();
        break;
      case "name":
        this._loadAllProducts();
        break;
    }
  }

  searchProduct() {
    this.productsService
      .getAllSearchedProducts(this.searchTerm)
      .then((data) => (this.allProducts = data))
      .catch((error) => console.error(error));
  }

  async presentPopoverOrderBy(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverOrderbyComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (criteria) => {
          this._loadProductsByCriteria(criteria);
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }
}
