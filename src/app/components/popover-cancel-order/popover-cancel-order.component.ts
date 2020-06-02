import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-cancel-order",
  templateUrl: "./popover-cancel-order.component.html",
  styleUrls: ["./popover-cancel-order.component.scss"],
})
export class PopoverCancelOrderComponent implements OnInit {
  @Input()
  public onclick = (answer) => {};

  constructor() {}

  ngOnInit() {}

  onYes() {
    this.onclick(true);
  }

  onNo() {
    this.onclick(false);
  }
}
