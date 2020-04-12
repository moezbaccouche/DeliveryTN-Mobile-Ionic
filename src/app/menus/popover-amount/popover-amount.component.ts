import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-amount",
  templateUrl: "./popover-amount.component.html",
  styleUrls: ["./popover-amount.component.scss"],
})
export class PopoverAmountComponent implements OnInit {
  private productAmount = 1;
  private isZero = false;
  @Input()
  public onclick = (productAmount) => {};

  constructor() {}

  ngOnInit() {}

  addToCart() {
    this.onclick(this.productAmount);
  }

  incrementAmount() {
    this.isZero = false;
    this.productAmount++;
  }

  decrementAmount() {
    if (this.productAmount > 0) {
      this.productAmount--;
      if (this.productAmount == 0) {
        this.isZero = true;
      }
    }
  }
}
