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

  distance = 0;

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
          this.getMatch();
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

  getMatch() {
    var coordHome = [10.582612, 35.655248];
    var coordDeliveryMan = [10.578436, 35.698611];

    var coordinates = [coordHome, coordDeliveryMan];

    var cc = coordinates.join(";");

    this.deliveryInfosService.getRoute(cc, mapToken).then(
      (response: any) => {
        this.addRoute(response.routes[0].geometry);
        this.distance = response.routes[0].distance * 0.001;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addRoute(coords) {
    console.log(coords);
    // check if the route is already loaded
    if (this.map.getSource("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    } else {
      this.map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: coords,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1db7dd",
          "line-width": 8,
          "line-opacity": 0.8,
        },
      });
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
