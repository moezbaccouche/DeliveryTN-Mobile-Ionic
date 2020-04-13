import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverConfirmDeleteComponent } from "../../menus/popover-confirm-delete/popover-confirm-delete.component";
import { PopoverController, ToastController } from "@ionic/angular";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  cartProducts = [];
  cartCategories = [];
  clientAddress: any;
  clientCity: any;
  clientZipCode: any;
  userId = 1;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getCartProducts();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cartProducts = [];
  }

  async presentPopoverConfirmDelete(id: any) {
    const popover = await this.popoverController.create({
      component: PopoverConfirmDeleteComponent,
      event: id,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer) {
            this.deleteProduct(id, this.userId);
            this.presentToast("Article supprimé du panier !");
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  deleteProduct(productId, clientId) {
    this.productsService
      .deleteProductFromCart(productId, clientId)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
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

  getCartProducts() {
    this.productsService
      .getCartProducts(this.userId)
      .then(
        (data) => (
          (this.cartProducts = data.products),
          (this.cartCategories = data.categories),
          (this.clientAddress = data.client.location.address),
          (this.clientCity = data.client.location.city),
          (this.clientZipCode = data.client.location.zipCode)
        )
      )
      .catch((error) => console.error(error));
  }
}
