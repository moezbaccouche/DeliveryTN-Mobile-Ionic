import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductImagesSlidesComponent } from "../../components/product-images-slides/product-images-slides.component";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductsService } from "src/app/services/products.service";
import { ToastController } from "@ionic/angular";
import { Product } from "src/app/models/product.model";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.page.html",
  styleUrls: ["./product-details.page.scss"],
})
export class ProductDetailsPage implements OnInit, OnDestroy {
  productId = null;
  product: any = null;

  productAmount = 1;
  productPrice = 3;
  totalPrice = 3;
  isFavoriteProduct = false;

  clientId = 1;

  favoriteProducts: Product[] = [];

  favoriteProductsSubscription: Subscription;

  private sub: any;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private toastController: ToastController,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.productId = +params["id"];
      this.productsService.getProductDetailsFromApi(this.productId).then(
        (response) => {
          this.isLoading = false;
          this.product = response;
        },
        (error) => {
          console.log(error);
        }
      );
    });

    this.getFavoriteProducts();
    this.favoriteProductsSubscription = this.productsService.favoriteProductsSubject.subscribe(
      (products: Product[]) => {
        this.favoriteProducts = products;
        if (this.favoriteProducts.length != 0) {
          this.checkIsFavoriteProduct(this.productId);
        }
      }
    );
    this.productsService.emitFavoriteProductsSubject();
  }

  incrementAmount() {
    this.productAmount++;
    this.totalPrice = this.productAmount * this.productPrice;
  }

  decrementAmount() {
    if (this.productAmount > 1) {
      this.productAmount--;
      this.totalPrice = this.productAmount * this.productPrice;
    }
  }

  getFavoriteProducts() {
    this.productsService.getFavoriteProductsFromApi(this.clientId);
  }

  checkIsFavoriteProduct(productId) {
    const index = this.favoriteProducts.findIndex((p) => {
      return p.id === productId;
    });
    if (index != -1) {
      this.isFavoriteProduct = true;
    } else {
      this.isFavoriteProduct = false;
    }
  }

  reactToProduct() {
    if (this.isFavoriteProduct) {
      //The product is already liked so the click will remove it from the favorite products
      this.productsService.dislikeProduct(this.productId, this.clientId).then(
        () => {
          this.presentToast("Produit retiré des favoris !", "success");
          this.isFavoriteProduct = false;
        },
        (error) => {
          this.presentToast("Une erreur s'est produite !", "danger");
        }
      );
    } else {
      this.productsService.likeProduct(this.productId, this.clientId).then(
        () => {
          this.presentToast("Produit ajouté aux favoris !", "success");
          this.isFavoriteProduct = true;
        },
        (error) => {
          this.presentToast("Une erreur s'est produite !", "danger");
        }
      );
    }
  }

  addToCart() {
    this.productsService
      .addToCart(this.productId, this.clientId, this.productAmount.toString())
      .then(
        () => {
          this.presentToast("Produit ajouté au panier !", "success");
          this.router.navigate(["/cart"]);
        },
        (error) => {
          this.presentToast("Une erreur s'est produite !", "danger");
        }
      );
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

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
    this.sub.unsubscribe();
    this.favoriteProductsSubscription.unsubscribe();
  }
}
