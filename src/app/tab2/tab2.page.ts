import { Component } from "@angular/core";
import { CategoriesService } from "../services/categories.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  CategorySubscription: Subscription;

  private allCategories: any[];
  private isLoading = true;
  private searchTerm: string;
  constructor(
    private categoriesService: CategoriesService,
    private domSanitizer: DomSanitizer,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this._loadAllCategoriesFromApi();
    this.CategorySubscription = this.categoriesService.categorySubject.subscribe(
      (categories: any[]) => {
        this.allCategories = categories;
      }
    );
    this.categoriesService.emitCategorySubject();
  }

  _loadAllCategoriesFromApi() {
    this.categoriesService.getAllCategoriesFromApi().then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchCategory() {
    this.categoriesService.searchCategoriesFromApi(this.searchTerm);
  }
}
