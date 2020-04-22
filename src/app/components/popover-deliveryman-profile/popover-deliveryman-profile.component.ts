import { Component, OnInit, Input } from "@angular/core";
import { DeliveryMenService } from "src/app/services/deliveryMen.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-popover-deliveryman-profile",
  templateUrl: "./popover-deliveryman-profile.component.html",
  styleUrls: ["./popover-deliveryman-profile.component.scss"],
})
export class PopoverDeliverymanProfileComponent implements OnInit {
  @Input()
  public id: number;

  deliveryMan: any = {
    fullName: "",
    imageBase64: "",
    phone: "",
    email: "",
    rating: 0,
    nbRatings: 0,
  };

  starOne = 0;
  starTwo = 0;
  starThree = 0;
  starFour = 0;
  starFive = 0;

  isLoading = true;

  constructor(
    private deliveryMenService: DeliveryMenService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getDeliveryMan();
    this.initRatingStars();
  }

  getDeliveryMan() {
    this.deliveryMenService.getDeliveryManById(this.id).then(
      (response) => {
        this.deliveryMan = response;
        this.initRatingStars();
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  initRatingStars() {
    if (this.deliveryMan.rating >= 0 && this.deliveryMan.rating < 1) {
      this.starOne = 0.5;
    }
    if (this.deliveryMan.rating >= 1 && this.deliveryMan.rating < 2) {
      this.starOne = 1;
      this.starTwo = 0.5;
    }
    if (this.deliveryMan.rating >= 2 && this.deliveryMan.rating < 3) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 0.5;
    }
    if (this.deliveryMan.rating >= 3 && this.deliveryMan.rating < 4) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 0.5;
    }
    if (this.deliveryMan.rating >= 4 && this.deliveryMan.rating < 5) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 1;
      this.starFive = 0.5;
    }
    if (this.deliveryMan.rating == 5) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 1;
      this.starFive = 1;
    }
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
