import { Component, OnInit, Input } from "@angular/core";
import { mapToken } from "../../../assets/maptoken";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ToastController } from "@ionic/angular";
import { TestBed } from "@angular/core/testing";

declare var lngLat;

@Component({
  selector: "app-popover-map-location",
  templateUrl: "./popover-map-location.component.html",
  styleUrls: ["./popover-map-location.component.scss"],
})
export class PopoverMapLocationComponent implements OnInit {
  @Input()
  public onclick = (lat, long) => {};

  latitude: number;
  longitude: number;
  marker: {
    latitude: number;
    longitude: number;
    draggable: true;
  };

  coordsSet = false;

  constructor(
    private geolocation: Geolocation,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.onLocateMe();
  }

  onLocateMe() {
    this.geolocation.getCurrentPosition().then(
      (response) => {
        this.latitude = response.coords.latitude;
        this.longitude = response.coords.longitude;
      },
      (error) => {
        this.presentToast("Une erreur est survenue", "danger");
        console.log(error);
      }
    );
  }

  onMapClicked($event) {
    this.coordsSet = true;
    this.marker = {
      latitude: $event.coords.lat,
      longitude: $event.coords.lng,
      draggable: true,
    };
  }

  onConfirm() {
    this.onclick(this.marker.latitude, this.marker.longitude);
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: type,
    });
  }
}
