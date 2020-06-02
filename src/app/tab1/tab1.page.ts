import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverController } from "@ionic/angular";
import { PopoverOrderbyComponent } from "../menus/popover-orderby/popover-orderby.component";
import { PopoverAmountComponent } from "../menus/popover-amount/popover-amount.component";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Product } from "../models/product.model";
import { ClientsService } from "../services/clients.service";
import { Router } from "@angular/router";
import { OneSignal } from "@ionic-native/onesignal/ngx";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  favoriteProductsSubscription: Subscription;

  allProducts: Product[];
  favoriteProducts: Product[];
  searchTerm: string;
  clientId = 0;
  private isLoading = true;
  constructor(
    private domSanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private clientsService: ClientsService,
    private oneSignal: OneSignal,
    private router: Router
  ) {
    this.clientId = +localStorage.getItem("id");
  }

  ngOnInit(): void {
    this.loadAllProducts();
    this.productsSubscription = this.productsService.productSubject.subscribe(
      (products: Product[]) => {
        this.allProducts = products;
      }
    );
    this.productsService.emitProductsSubject();

    this.favoriteProductsSubscription = this.productsService.favoriteProductsSubject.subscribe(
      (favoriteProducts: Product[]) => {
        this.favoriteProducts = favoriteProducts;
      }
    );
    this.productsService.emitFavoriteProductsSubject();

    this.setupPush();
  }

  loadAllProducts() {
    this.productsService.getProductsFromApi(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur est survenue !", "danger");
        console.log(error);
      }
    );
  }

  loadProductsByPriceAsc() {
    this.productsService.getAllProductsByPriceAscFromApi();
  }

  loadProductsByPriceDesc() {
    this.productsService.getAllProductsByPriceDescFromApi();
  }

  searchProduct() {
    this.productsService.getAllSearchedProductsFromApi(this.searchTerm);
  }

  reactToProduct(productId: any) {
    // Check if the selected product is already liked
    const productIndex = this.allProducts.findIndex((p) => {
      return p.id === productId;
    });

    const isLiked = this.allProducts[productIndex].isFavorite;
    if (isLiked) {
      //Dislike the product
      this.productsService.dislikeProduct(productId, this.clientId).then(
        () => {
          this.presentToast("Produit retiré des favoris !", "success");
        },
        (error) => {
          this.presentToast("Une erreur s'est produite !", "danger");
        }
      );
    } else {
      //Like the product
      this.productsService.likeProduct(productId, this.clientId).then(
        () => {
          this.presentToast("Produit ajouté aux favoris !", "success");
        },
        (error) => {
          this.presentToast("Une erreur s'est produite !", "danger");
        }
      );
    }
  }

  loadProductsByCriteria(criteria) {
    switch (criteria) {
      case "asc":
        this.loadProductsByPriceAsc();
        break;
      case "desc":
        this.loadProductsByPriceDesc();
        break;
      case "name":
        this.loadAllProducts();
        break;
    }
  }

  async presentPopoverOrderBy(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverOrderbyComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (criteria) => {
          this.loadProductsByCriteria(criteria);
          popover.dismiss();
        },
      },
    });

    return await popover.present();
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

          this.productsService
            .addToCart(id, this.clientId, productAmount.toString())
            .then(
              () => {
                this.presentToast("Article ajouté au panier !", "success");
              },
              (error) => {
                this.presentToast("Une erreur est survenue !", "danger");
                console.log(error);
              }
            );

          popoverAmount.dismiss();
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

  setupPush() {
    this.oneSignal.startInit(
      "4d92a6e0-c0bb-42b6-8bf1-01be7bc90286",
      "636537591278"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    this.oneSignal.handleNotificationReceived().subscribe((data) => {});

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      this.router.navigate(["/tabs"]);
    });
    this.oneSignal.endInit();
    this.oneSignal.getIds().then((response) => {
      //Insert or update the client player ID
      this.clientsService.setPlayerId(this.clientId, response.userId).subscribe(
        () => {},
        (error) => {
          this.presentToast("Une erreur est survenue !", "danger");
          console.log(error);
        }
      );
    });
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
