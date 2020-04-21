import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  sub: Subscription;
  orderId;
  order: any;

  isLoading = true;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

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
}
