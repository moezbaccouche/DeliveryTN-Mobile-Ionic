import { Component, OnInit, Input } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-popover-component",
  templateUrl: "./popover-component.page.html",
  styleUrls: ["./popover-component.page.scss"],
})
export class PopoverComponentPage implements OnInit {
  test: number = 0;

  @Input()
  public onclick = (test) => {};

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  EditProfile() {
    this.test = 1;
    this.onclick(this.test);
  }

  EditPic() {
    this.test = 2;
    this.onclick(this.test);
  }

  LogOut() {
    this.test = 3;
    this.onclick(this.test);
  }
}
