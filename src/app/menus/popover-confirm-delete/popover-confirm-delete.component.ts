import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-confirm-delete",
  templateUrl: "./popover-confirm-delete.component.html",
  styleUrls: ["./popover-confirm-delete.component.scss"],
})
export class PopoverConfirmDeleteComponent implements OnInit {
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
