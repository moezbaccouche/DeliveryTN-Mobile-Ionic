import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-request-bill",
  templateUrl: "./popover-request-bill.component.html",
  styleUrls: ["./popover-request-bill.component.scss"],
})
export class PopoverRequestBillComponent implements OnInit {
  @Input()
  public onclick = (answer) => {};

  answer = true;

  constructor() {}

  ngOnInit() {}

  onYes() {
    this.answer = true;
    this.onclick(this.answer);
  }

  onNo() {
    this.answer = false;
    this.onclick(this.answer);
  }
}
