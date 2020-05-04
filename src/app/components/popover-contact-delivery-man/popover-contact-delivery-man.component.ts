import { Component, OnInit, Input } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-popover-contact-delivery-man",
  templateUrl: "./popover-contact-delivery-man.component.html",
  styleUrls: ["./popover-contact-delivery-man.component.scss"],
})
export class PopoverContactDeliveryManComponent implements OnInit {
  @Input()
  public onclick = () => {};

  @Input()
  public deliveryManPhoneNumber: any;

  @Input()
  public deliveryManEmailAddress: any;

  constructor(
    private callNumber: CallNumber,
    private sms: SMS,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  onCall() {
    this.callNumber
      .callNumber(this.deliveryManPhoneNumber, true)
      .then((res) => console.log("launched dialer", res))
      .catch((error) => {
        this.presentToast("Impossible de passer l'appel !", "danger");
        console.log(error);
      });
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
