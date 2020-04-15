import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-confirm-empty-cart",
  templateUrl: "./popover-confirm-empty-cart.component.html",
  styleUrls: ["./popover-confirm-empty-cart.component.scss"],
})
export class PopoverConfirmEmptyCartComponent implements OnInit {
  confirm = false;

  @Input()
  public onclick = (answer) => {};

  constructor() {}

  ngOnInit() {}

  cancel() {
    this.confirm = false;
    this.onclick(this.confirm);
  }

  delete() {
    this.confirm = true;
    this.onclick(this.confirm);
  }
}
