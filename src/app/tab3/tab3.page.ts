import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { OrdersService } from "../services/orders.service";
import { ToastController, PopoverController } from "@ionic/angular";
import { PopoverComplaintMethodComponent } from "../components/popover-complaint-method/popover-complaint-method.component";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit, OnDestroy {
  clientOrders: any = [];
  clientId = 0;

  isLoading = true;

  clientOrdersSubscription: Subscription;

  constructor(
    private ordersService: OrdersService,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private domSanitizer: DomSanitizer
  ) {
    this.clientId = +localStorage.getItem("id");
  }

  ngOnInit(): void {
    this.getClientOrders();

    this.clientOrdersSubscription = this.ordersService.clientOrdersSubject.subscribe(
      (orders: any[]) => {
        this.clientOrders = orders;
      }
    );
    this.ordersService.emitClientOrdersSubject();
  }

  ionViewWillEnter() {
    this.getClientOrders();
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

  async presentPopoverComplaintMethod(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComplaintMethodComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: () => {
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  ngOnDestroy(): void {
    this.clientOrdersSubscription.unsubscribe();
  }
}
