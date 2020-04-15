import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../../services/products.service";
import { CategoriesService } from "../../services/categories.service";
import { DomSanitizer } from "@angular/platform-browser";

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

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
