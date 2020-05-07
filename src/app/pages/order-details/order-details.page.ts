import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ToastController, PopoverController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverRatingComponent } from "src/app/components/popover-rating/popover-rating.component";
import { PopoverDeliverymanProfileComponent } from "src/app/components/popover-deliveryman-profile/popover-deliveryman-profile.component";
import { DeliveryMenService } from "src/app/services/deliveryMen.service";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  sub: Subscription;
  orderId;
  order: any;

  clientId = 0;

  isLoading = true;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController,
    private deliveryMenService: DeliveryMenService
  ) {
    this.clientId = +localStorage.getItem("id");
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.orderId = +params["id"];
    });
  }

  ionViewDidEnter() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.ordersService.getOrderDetails(this.orderId).then(
      (response) => {
        this.order = response;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
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

  async presentPopoverRating(initialRating: any) {
    const popover = await this.popoverController.create({
      component: PopoverRatingComponent,
      translucent: true,
      componentProps: {
        clientRating: initialRating,
        onclick: (rating) => {
          console.log(rating);
          if (initialRating == 0) {
            //This means that it's the first time that the client is rating this delivery man
            this.deliveryMenService
              .rateDeliveryMan(this.clientId, this.order.deliveryManId, rating)
              .then(
                () => {
                  this.presentToast("Note affectée au livreur !", "success");
                  this.order.deliveryManClientRating = rating;
                },
                (error) => {
                  this.presentToast("Une erreur est survenue !", "danger");
                  console.log(error);
                }
              );
          } else {
            //This means that the user is changing his rating
            this.deliveryMenService
              .editDeliveryManRating(
                this.clientId,
                this.order.deliveryManId,
                rating
              )
              .then(
                () => {
                  this.presentToast("Note affectée au livreur !", "success");
                  this.order.deliveryManClientRating = rating;
                },
                (error) => {
                  this.presentToast("Une erreur est survenue !", "danger");
                  console.log(error);
                }
              );
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  async presentPopoverDeliveryManProfile(idDeliv: any) {
    const popover = await this.popoverController.create({
      component: PopoverDeliverymanProfileComponent,
      event: idDeliv,
      translucent: true,
      componentProps: {
        id: idDeliv,
        onclick: () => {
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }
}
