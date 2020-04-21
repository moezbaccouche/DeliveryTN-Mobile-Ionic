import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { OrdersService } from "../services/orders.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit, OnDestroy {
  treatedOrders: any = [];
  clientId = 1;

  isLoading = true;

  treatedOrdersSubscription: Subscription;

  constructor(
    private ordersService: OrdersService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.getTreatedOrders();
    this.treatedOrdersSubscription = this.ordersService.treatedOrdersSubject.subscribe(
      (orders: any[]) => {
        this.treatedOrders = orders;
        console.log(this.treatedOrders);
      }
    );
  }

  getTreatedOrders() {
    this.ordersService.getTreatedOrders(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur est survenue !", "danger");
        console.log(error);
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

  ngOnDestroy(): void {}
}
