import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DeliveryInfosService } from "src/app/services/deliveryInfos.service";
import { ClientsService } from "src/app/services/clients.service";

@Component({
  selector: "app-track-delivery",
  templateUrl: "./track-delivery.page.html",
  styleUrls: ["./track-delivery.page.scss"],
})
export class TrackDeliveryPage implements OnInit, OnDestroy {
  deliveryInfos: any = null;
  clientId = 1;
  client: any = null;

  orderId: number;
  isLoading = true;

  private sub: Subscription;
  private clientSubscription: Subscription;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private deliveryInfosService: DeliveryInfosService,
    private clientsService: ClientsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.orderId = +params["orderId"];
      this.getDeliveryInfos();
    });

    this.getClient();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: any) => {
        this.client = client;
        console.log(this.client);
      }
    );
    this.clientsService.emitClientSubject();
  }

  getDeliveryInfos() {
    this.deliveryInfosService.getOrderDeliveryInfos(this.orderId).then(
      (response) => {
        this.isLoading = false;
        this.deliveryInfos = response;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  getClient() {
    this.clientsService.getClient(this.clientId).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  onGoBack() {
    this.navController.pop();
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
    this.sub.unsubscribe();
  }
}
