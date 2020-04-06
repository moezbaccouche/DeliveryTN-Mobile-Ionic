import { Component, OnInit, Input } from "@angular/core";
import { ProductsService } from "../../services/products.service";

@Component({
  selector: "app-popover-orderby",
  templateUrl: "./popover-orderby.component.html",
  styleUrls: ["./popover-orderby.component.scss"],
})
export class PopoverOrderbyComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  @Input()
  public onclick = (criteria) => {};

  criteria: string;

  ngOnInit() {}

  loadProductsByPriceAsc() {
    this.criteria = "asc";
    this.onclick(this.criteria);
  }

  loadProductsByPriceDesc() {
    this.criteria = "desc";
    this.onclick(this.criteria);
  }

  loadProductsByName() {
    this.criteria = "name";
    this.onclick(this.criteria);
  }
}
