import { Component, OnInit } from "@angular/core";
import { mapToken } from "../../../assets/maptoken";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Subscription } from "rxjs";
import { ClientsService } from "src/app/services/clients.service";
import { ToastController, NavController } from "@ionic/angular";
import { DeliveryInfosService } from "src/app/services/deliveryInfos.service";

@Component({
  selector: "app-track-delivery-map",
  templateUrl: "./track-delivery-map.page.html",
  styleUrls: ["./track-delivery-map.page.scss"],
})
export class TrackDeliveryMapPage implements OnInit {
  clientId = 1;
  client: any = {
    location: {
      lat: 0,
      lng: 0,
    },
  };
  isLoading = true;

  deliveryInfos: any = {
    estimatedDeliveryTime: "2020-04-25T15:00:00",
    distance: 0,
  };
  orderId = 2;

  private map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v11";
  lat = 37.75;
  lng = -122.41;

  clientSubscription: Subscription;
  sub: Subscription;

  constructor(
    private clientsService: ClientsService,
    private toastController: ToastController,
    private navController: NavController,
    private deliveryInfosService: DeliveryInfosService
  ) {
    mapboxgl.accessToken = mapToken;
  }

  ngOnInit() {
    this.getClient();
    this.getOrderDeliveryInfos();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: any) => {
        this.client = client;
        this.initClientCoordinates();
        setTimeout(() => {
          this.buildMap();
        }, 0);
      }
    );
  }

  getClient() {
    this.clientsService.getClient(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  getOrderDeliveryInfos() {
    this.deliveryInfosService.getOrderDeliveryInfos(this.orderId).then(
      (response) => {
        this.deliveryInfos = response;
        console.log(this.deliveryInfos);
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  initClientCoordinates() {
    this.lat = this.client.location.lat;
    this.lng = this.client.location.long;
  }

  buildMap() {
    let conf = {
      container: "map",
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
      //center : [long, lat]
    };
    console.log(this.lat + " " + this.lng);
    this.map = new mapboxgl.Map(conf);
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    var marker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
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
}
