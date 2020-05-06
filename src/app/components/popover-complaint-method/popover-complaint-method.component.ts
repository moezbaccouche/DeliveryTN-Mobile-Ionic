import { Component, OnInit, Input } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { ToastController } from "@ionic/angular";
import { SMS } from "@ionic-native/sms/ngx";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-popover-complaint-method",
  templateUrl: "./popover-complaint-method.component.html",
  styleUrls: ["./popover-complaint-method.component.scss"],
})
export class PopoverComplaintMethodComponent implements OnInit {
  @Input()
  public onclick = () => {};

  constructor(
    private callNumber: CallNumber,
    private sms: SMS,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  onCall() {
    this.callNumber
      .callNumber("24323572", true)
      .then((res) => console.log("launched dialer", res))
      .catch((error) => {
        this.presentToast("Impossible de passer l'appel !", "danger");
        console.log(error);
      });
    this.onclick();
  }

  onCancel() {
    this.onclick();
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }
}
