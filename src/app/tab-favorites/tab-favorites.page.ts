import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { Product } from "../models/product.model";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab-favorites",
  templateUrl: "./tab-favorites.page.html",
  styleUrls: ["./tab-favorites.page.scss"],
})
export class TabFavoritesPage implements OnInit, OnDestroy {
  favoriteProductsSubscription: Subscription;
  favoriteProducts = [];
  isLoading = true;
  clientId = 1;
  constructor(
    private productsService: ProductsService,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController
  ) {}

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
    this.productsService.dislikeProductApi(id, this.clientId).then(
      () => {
        this.presentToast("Produit retiré des favoris !", "success");
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log("Error occured during disliking product" + error);
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
    this.favoriteProductsSubscription.unsubscribe();
  }
}
