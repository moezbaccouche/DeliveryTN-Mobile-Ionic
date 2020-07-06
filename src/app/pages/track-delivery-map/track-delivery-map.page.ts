import { Component, OnInit, OnDestroy } from "@angular/core";
import { mapToken } from "../../../assets/maptoken";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Subscription } from "rxjs";
import { ClientsService } from "src/app/services/clients.service";
import {
  ToastController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { DeliveryInfosService } from "src/app/services/deliveryInfos.service";
import { PopoverContactDeliveryManComponent } from "src/app/components/popover-contact-delivery-man/popover-contact-delivery-man.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-track-delivery-map",
  templateUrl: "./track-delivery-map.page.html",
  styleUrls: ["./track-delivery-map.page.scss"],
})
export class TrackDeliveryMapPage implements OnInit, OnDestroy {
  clientId = 0;
  client: any = {
    location: {
      lat: 0,
      lng: 0,
    },
  };
  isLoading = true;

  deliveryInterval = null;

  deliveryInfos: any = {
    estimatedDeliveryTime: "2020-04-25T15:00:00",
    distance: 0,
    deliveryMan: {
      id: 1,
      location: {
        lat: 0,
        lng: 0,
      },
    },
  };
  orderId = 2;

  distance = 0;

  private map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v11";
  clientLat = 0;
  clientLng = 0;

  deliveryManLat = 0;
  deliveryManLng = 0;

  marker: any;

  clientSubscription: Subscription;
  sub: Subscription;

  constructor(
    private clientsService: ClientsService,
    private toastController: ToastController,
    private navController: NavController,
    private deliveryInfosService: DeliveryInfosService,
    private popoverController: PopoverController,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    mapboxgl.accessToken = mapToken;
    this.clientId = +localStorage.getItem("id");
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(
      (params) => {
        this.orderId = +params["orderId"];
        this.getOrderDeliveryInfos();
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
        this.initClientCoordinates();
        setTimeout(() => {
          this.buildMap();
          this.addDeliveryManMarker();
          this.getMatch();
        }, 0);
      }
    );
  }

  ionViewDidEnter() {
    this.getMatch();
    this.addDeliveryManMarker();
    this.getUpdatedDeliveryManLocation();
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
      (response: any) => {
        this.deliveryInfos = response;
        console.log(response);
        this.getDeliveryManCurrentLocation();
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  initClientCoordinates() {
    this.clientLat = this.client.location.lat;
    this.clientLng = this.client.location.long;
  }

  buildMap() {
    let conf = {
      container: "map",
      style: this.style,
      zoom: 13,
      center: [this.clientLng, this.clientLat],
      //center : [long, lat]
    };
    this.map = new mapboxgl.Map(conf);
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    var marker = new mapboxgl.Marker()
      .setLngLat([this.clientLng, this.clientLat])
      .addTo(this.map);
  }

  onGoBack() {
    this.navController.pop();
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
          this.addRoute(response.routes[0].geometry);
          this.distance = response.routes[0].distance * 0.001;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  addRoute(coords) {
    // check if the route is already loaded
    if (this.map.getSource("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
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

  getDeliveryManCurrentLocation() {
    this.deliveryInfosService
      .getDeliveryManCurrentLocation(this.deliveryInfos.deliveryMan.id)
      .then(
        (response: any) => {
          this.deliveryManLat = response.lat;
          this.deliveryManLng = response.long;
        },
        (error) => {
          this.presentToast("Une erreur est survenue !", "danger");
          console.log(error);
        }
      );
  }

  getUpdatedDeliveryManLocation() {
    this.deliveryInterval = setInterval(() => {
      this.deliveryInfosService
        .getDeliveryManCurrentLocation(this.deliveryInfos.deliveryMan.id)
        .then(
          (response: any) => {
            console.log(response);
            this.deliveryManLat = response.lat;
            this.deliveryManLng = response.long;
            this.getMatch();

            this.marker.remove();
            this.addDeliveryManMarker();
          },
          (error) => {
            this.presentToast("Une erreur est survenue !", "danger");
            console.log(error);
          }
        );
    }, 5000);
  }

  addDeliveryManMarker() {
    var el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = "url(../../../assets/deliveryTruck48.png)";
    el.style.width = "48px";
    el.style.height = "48px";

    this.marker = new mapboxgl.Marker(el)
      .setLngLat([this.deliveryManLng, this.deliveryManLat])
      .addTo(this.map);
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

  async presentPopoverContactDeliveryMan(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverContactDeliveryManComponent,
      event: ev,
      translucent: true,
      componentProps: {
        deliveryManPhoneNumber: this.deliveryInfos.deliveryMan.phone,
        deliveryManEmailAddress: this.deliveryInfos.deliveryMan.email,
        onclick: () => {
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  ngOnDestroy(): void {
    clearInterval(this.deliveryInterval);
  }
}
