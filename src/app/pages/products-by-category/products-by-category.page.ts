import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../../services/products.service";
import { CategoriesService } from "../../services/categories.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastController, PopoverController } from "@ionic/angular";
import { PopoverAmountComponent } from "src/app/menus/popover-amount/popover-amount.component";

@Component({
  selector: "app-products-by-category",
  templateUrl: "./products-by-category.page.html",
  styleUrls: ["./products-by-category.page.scss"],
})
export class ProductsByCategoryPage implements OnInit, OnDestroy {
  categoryId = null;
  categoryName = null;
  categoryProducts = [];
  private sub: any;

  clientId = 0;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.clientId = +localStorage.getItem("id");

    this.sub = this.route.params.subscribe((params) => {
      this.categoryId = +params["id"];

      //Load category name
      this.categoryName = this.categoriesService.getCategoryByIdFromApi(
        this.categoryId
      ).name;
    });

    //Load products having as category the selected category
    this.productsService
      .getProductsByCategoryId(this.categoryId)
      .then((data) => {
        this.categoryProducts = data;
      })
      .catch((error) => console.error(error));
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
    this.sub.unsubscribe();
  }
}
