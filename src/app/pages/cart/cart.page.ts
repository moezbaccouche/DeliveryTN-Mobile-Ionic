import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverConfirmDeleteComponent } from "../../menus/popover-confirm-delete/popover-confirm-delete.component";
import { PopoverController, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { PopoverConfirmEmptyCartComponent } from "src/app/menus/popover-confirm-empty-cart/popover-confirm-empty-cart.component";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  cartProductsSubscription: Subscription;
  cartProductsCategoriesSubscription: Subscription;

  cartProducts = [];
  cartCategories = [];
  clientInfos: any;
  clientAddress: any;
  clientCity: any;
  clientZipCode: any;
  userId = 2;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getCartProductsFromApi();
    this.cartProductsSubscription = this.productsService.cartProductSubject.subscribe(
      (products: Product[]) => {
        this.cartProducts = products;
      }
    );
    this.productsService.emitCartProductsSubject();
    this.cartProductsCategoriesSubscription = this.productsService.cartProductsCategoriesSubject.subscribe(
      (categories: any[]) => {
        this.cartCategories = categories;
      }
    );
  }

  getCartProductsFromApi() {
    this.productsService.getCartProductsFromApi(this.userId).then((data) => {
      this.clientInfos = data["client"]["location"];
      this.cartCategories = data["categories"];

      this.clientCity = this.clientInfos.city;
      this.clientZipCode = this.clientInfos.zipCode;
      this.clientAddress = this.clientInfos.address;
    });
  }

  emptyCart() {}

  async presentPopoverConfirmDelete(product: any) {
    const popover = await this.popoverController.create({
      component: PopoverConfirmDeleteComponent,
      event: product,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer) {
            this.deleteProduct(product.id, this.userId, product.categoryId);
            this.presentToast("Article supprimé du panier !");
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  async presentPopoverConfirmEmptyCart(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverConfirmEmptyCartComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer) {
            this.productsService.removeAllCartProducts(this.userId).then(
              () => {
                this.presentToast("Articles supprimés du panier !");
              },
              (error) => {
                console.error(error);
              }
            );
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  deleteProduct(productId, clientId, categoryId) {
    this.productsService.deleteProductFromCartApi(
      productId,
      clientId,
      categoryId
    );
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: "success",
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.cartProductsSubscription.unsubscribe();
  }
}
