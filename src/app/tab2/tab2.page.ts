import { Component } from "@angular/core";
import { CategoriesService } from "../services/categories.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  private allCategories: any;
  private isLoading = true;
  private searchTerm: string;
  constructor(
    private categoriesService: CategoriesService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._loadAllCategories();
  }

  _loadAllCategories() {
    this.categoriesService
      .getAllCategories()
      .then((data) => {
        this.allCategories = data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = true;
      });
  }

  searchCategory() {
    this.categoriesService
      .searchCategories(this.searchTerm)
      .then((data) => (this.allCategories = data))
      .catch((error) => console.error(error));
  }
}
