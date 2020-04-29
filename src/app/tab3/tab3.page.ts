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
  clientOrders: any = [];
  clientId = 1;

  isLoading = true;

  clientOrdersSubscription: Subscription;

  constructor(
    private ordersService: OrdersService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.getClientOrders();

    this.clientOrdersSubscription = this.ordersService.clientOrdersSubject.subscribe(
      (orders: any[]) => {
        console.log(orders);
        this.clientOrders = orders;
        console.log(this.clientOrders);
      }
    );
    this.ordersService.emitClientOrdersSubject();
  }

  getClientOrders() {
    this.ordersService.getClientOrders(this.clientId).then(
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

  ngOnDestroy(): void {
    this.clientOrdersSubscription.unsubscribe();
  }
}
