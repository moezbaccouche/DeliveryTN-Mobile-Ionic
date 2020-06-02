import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverConfirmDeleteComponent } from "../../menus/popover-confirm-delete/popover-confirm-delete.component";
import { PopoverController, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { PopoverConfirmEmptyCartComponent } from "src/app/menus/popover-confirm-empty-cart/popover-confirm-empty-cart.component";
import { EditDeliveryAddressPopoverComponent } from "src/app/menus/edit-delivery-address-popover/edit-delivery-address-popover.component";
import { OrdersService } from "../../services/orders.service";
import { PopoverRequestBillComponent } from "src/app/components/popover-request-bill/popover-request-bill.component";
import { Router } from "@angular/router";
import { DeliveryMenService } from "src/app/services/deliveryMen.service";
import { PushService } from "src/app/services/push.service";
import { DeliveryInfosService } from "src/app/services/deliveryInfos.service";
import { mapToken } from "../../../assets/maptoken";

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

  productsPrice: number = 0;
  deliveryPrice: number = 5;
  totalPrice: number = 0;

  // orderIsPending = false;
  // showTimeTable = false;

  centerLat = 35.828888;
  centerLong = 10.640388;
  distance = 0;

  clientId = 0;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private ordersService: OrdersService,
    private router: Router,
    private deliveryMenService: DeliveryMenService,
    private pushService: PushService,
    private deliveryInfosService: DeliveryInfosService
  ) {
    this.clientId = +localStorage.getItem("id");
  }

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
    this.productsService.getCartProductsFromApi(this.clientId).then((data) => {
      this.clientInfos = data["client"]["location"];
      this.cartCategories = data["categories"];

      this.clientCity = this.clientInfos.city;
      this.clientZipCode = this.clientInfos.zipCode;
      this.clientAddress = this.clientInfos.address;

      this.getCartProductsPrice();
    });
  }

  getCartProductsPrice() {
    this.productsPrice = 0;
    this.cartProducts.forEach((p) => {
      this.productsPrice += p.totalProductPrice;
      this.totalPrice = this.productsPrice + this.deliveryPrice;
    });
  }

  makeOrder(requestBill, distance) {
    this.ordersService.makeNewOrder(this.clientId, requestBill, distance).then(
      () => {
        this.presentToast("Commande effectuée !", "success");
        this.getCartProductsFromApi();

        this.deliveryMenService
          .getAllDeliveryMenPlayersIds()
          .subscribe((ids: any) => {
            console.log(ids);
            this.pushService
              .sendNotification(
                "Nouvelle commande",
                "Une nouvelle commande a été enregistrée.",
                ids
              )
              .subscribe(
                () => {},
                (error) => {
                  this.presentToast("Une erreur s'est produite !", "danger");
                  console.log(error);
                }
              );
          });
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
      }
    );
  }

  // editDesiredDeliveryTime(ev, time) {
  //   console.log(time);
  // }

  // showTable() {
  //   if (this.showTimeTable) this.showTimeTable = false;
  //   else this.showTimeTable = true;
  // }

  async presentPopoverConfirmDelete(product: any) {
    const popover = await this.popoverController.create({
      component: PopoverConfirmDeleteComponent,
      event: product,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer) {
            this.deleteProduct(product.id, this.clientId, product.categoryId);
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
            this.productsService.removeAllCartProducts(this.clientId).then(
              () => {
                this.presentToast("Articles supprimés du panier !", "success");
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

  async presentPopoverEditAddress(ev: any) {
    const popover = await this.popoverController.create({
      component: EditDeliveryAddressPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: () => {
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  async presentPopoverRequestBill(product: any) {
    const popover = await this.popoverController.create({
      component: PopoverRequestBillComponent,
      event: product,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          this.getMatch(answer);

          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  deleteProduct(productId, clientId, categoryId) {
    this.productsService
      .deleteProductFromCart(productId, clientId, categoryId)
      .then(
        () => {
          this.getCartProductsPrice();
          this.presentToast("Article supprimé du panier !", "success");
        },
        (error) => {
          console.log(error);
          this.presentToast("Une erreur est survenue !", "danger");
        }
      );
  }

  getMatch(answer) {
    const coordsClient = [this.clientInfos.long, this.clientInfos.lat];
    const coordsCenter = [this.centerLong, this.centerLat];

    const coords = [coordsCenter, coordsClient];
    var newCoords = coords.join(";");

    this.deliveryInfosService.getRoute(newCoords, mapToken).then(
      (response: any) => {
        this.distance = response.routes[0].distance * 0.001;
        console.log(this.distance);
        this.makeOrder(answer, parseFloat(this.distance.toFixed(2)));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.cartProductsSubscription.unsubscribe();
  }
}
