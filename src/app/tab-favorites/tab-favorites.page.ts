import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { Product } from "../models/product.model";
import { ToastController, PopoverController } from "@ionic/angular";
import { PopoverAmountComponent } from "../menus/popover-amount/popover-amount.component";

@Component({
  selector: "app-tab-favorites",
  templateUrl: "./tab-favorites.page.html",
  styleUrls: ["./tab-favorites.page.scss"],
})
export class TabFavoritesPage implements OnInit, OnDestroy {
  favoriteProductsSubscription: Subscription;
  favoriteProducts = [];
  isLoading = true;
  clientId = 0;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController,
    private popoverController: PopoverController
  ) {
    this.clientId = +localStorage.getItem("id");
  }

  ngOnInit() {
    this.getFavoriteProducts();
    this.favoriteProductsSubscription = this.productsService.favoriteProductsSubject.subscribe(
      (products: Product[]) => {
        this.favoriteProducts = products;
      }
    );
    this.productsService.emitFavoriteProductsSubject();
  }

  ionViewWillEnter() {
    this.getFavoriteProducts();
  }

  getFavoriteProducts() {
    this.productsService.getFavoriteProductsFromApi(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  dislikeProduct(id) {
    this.productsService.dislikeProduct(id, this.clientId).then(
      () => {
        this.presentToast("Produit retiré des favoris !", "success");
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log("Error occured during disliking product" + error);
      }
    );
  }

  async presentPopoverAmount(id: any) {
    const popoverAmount = await this.popoverController.create({
      component: PopoverAmountComponent,
      translucent: true,
      componentProps: {
        onclick: (productAmount) => {
          //Add the article to the Order table in the DB with its ID, current user ID and the amount
          //
          //
          //

          this.productsService.addToCart(
            id,
            this.clientId,
            productAmount.toString()
          );

          popoverAmount.dismiss();
          this.presentToast("Article ajouté au panier !", "success");
        },
      },
    });

    return await popoverAmount.present();
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
    this.favoriteProductsSubscription.unsubscribe();
  }
}
