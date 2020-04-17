import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverController } from "@ionic/angular";
import { PopoverOrderbyComponent } from "../menus/popover-orderby/popover-orderby.component";
import { PopoverAmountComponent } from "../menus/popover-amount/popover-amount.component";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Product } from "../models/product.model";

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
  clientId = 1;
  constructor(
    private domSanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverController: PopoverController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this._loadAllProducts();
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
  }

  _loadAllProducts() {
    this.productsService.getProductsFromApi();
  }

  _loadProductsByPriceAsc() {
    this.productsService.getAllProductsByPriceAscFromApi();
  }

  _loadProductsByPriceDesc() {
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

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
