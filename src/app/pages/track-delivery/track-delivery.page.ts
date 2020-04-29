import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DeliveryInfosService } from "src/app/services/deliveryInfos.service";
import { ClientsService } from "src/app/services/clients.service";
import { mapToken } from "../../../assets/maptoken";

@Component({
  selector: "app-track-delivery",
  templateUrl: "./track-delivery.page.html",
  styleUrls: ["./track-delivery.page.scss"],
})
export class TrackDeliveryPage implements OnInit, OnDestroy {
  deliveryInfos: any = null;
  clientId = 1;
  client: any = null;
  clientLat = 0;
  clientLng = 0;

  deliveryManLat = 0;
  deliveryManLng = 0;

  distance = 0;

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
    this.sub = this.route.params.subscribe(
      (params) => {
        this.orderId = +params["orderId"];
        this.getDeliveryInfos();
      },
      (error) => {
        this.presentToast("Une erreur est survenue !", "danger");
        console.log(error);
      }
    );

    this.getClient();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: any) => {
        this.client = client;
        if (client != undefined) {
          this.clientLat = client.location.lat;
          this.clientLng = client.location.long;
        }
      }
    );
    this.clientsService.emitClientSubject();
  }

  getDeliveryInfos() {
    this.deliveryInfosService.getOrderDeliveryInfos(this.orderId).then(
      (response) => {
        this.isLoading = false;
        this.deliveryInfos = response;
        this.getDeliveryManCurrentLocation();
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  getClient() {
    this.clientsService.getClient(this.clientId).then(
      (response) => {},
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  onGoBack() {
    this.navController.pop();
  }

  getDeliveryManCurrentLocation() {
    this.deliveryInfosService
      .getDeliveryManCurrentLocation(this.deliveryInfos.deliveryMan.id)
      .then(
        (response: any) => {
          console.log(response);
          this.deliveryManLat = response.lat;
          this.deliveryManLng = response.long;
          this.getMatch();
        },
        (error) => {
          this.presentToast("Une erreur est survenue !", "danger");
          console.log(error);
        }
      );
  }

  getMatch() {
    const coordsClients = [this.clientLng, this.clientLat];
    const coordsDeliveryMan = [this.deliveryManLng, this.deliveryManLat];

    const coords = [coordsDeliveryMan, coordsClients];
    var newCoords = coords.join(";");

    if (
      this.clientLng != 0 &&
      this.clientLat != 0 &&
      this.deliveryManLat != 0 &&
      this.deliveryManLng != 0
    ) {
      this.deliveryInfosService.getRoute(newCoords, mapToken).then(
        (response: any) => {
          this.distance = response.routes[0].distance * 0.001;
          console.log(this.distance);
        },
        (error) => {
          console.log(error);
        }
      );
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
