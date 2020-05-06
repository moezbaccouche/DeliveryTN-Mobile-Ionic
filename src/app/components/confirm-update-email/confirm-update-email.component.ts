import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-confirm-update-email",
  templateUrl: "./confirm-update-email.component.html",
  styleUrls: ["./confirm-update-email.component.scss"],
})
export class ConfirmUpdateEmailComponent implements OnInit {
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
