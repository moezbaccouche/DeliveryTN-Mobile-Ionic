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
  constructor(
    private categoriesService: CategoriesService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._loadAllCategories();
  }

  _loadAllCategories() {
    this.categoriesService.getAllCategories().then((data) => {
      this.isLoading = false;
      this.allCategories = data;
    });
  }
}
