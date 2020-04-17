<<<<<<< Updated upstream
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  ModalController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { ProfileImageModalPage } from "../profile-image-modal/profile-image-modal.page";
import { PopoverComponentPage } from "../popover-component/popover-component.page";
import { Subscription } from "rxjs";
import { ClientsService } from "../services/clients.service";
import { Client } from "../models/client.model";
import { DomSanitizer } from "@angular/platform-browser";
=======
import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, ActionSheetController } from '@ionic/angular';
import { ProfileImageModalPage } from '../profile-image-modal/profile-image-modal.page';
import { PopoverComponentPage } from '../popover-component/popover-component.page';
>>>>>>> Stashed changes

@Component({
  selector: "app-tab-profile",
  templateUrl: "./tab-profile.page.html",
  styleUrls: ["./tab-profile.page.scss"],
})
export class TabProfilePage implements OnInit, OnDestroy {
  passwordType: string = "password";
  iconType: string = "eye-off-outline";
  passwordShown: boolean = false;
  ButtonDisabled: boolean;
  readOnly: boolean;

  nomImage: string = "me";

  clientSubscription: Subscription;
  client: Client;
  clientId = 1;

  isLoading = true;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private clientsService: ClientsService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {
    this.ButtonDisabled = true;
    this.readOnly = true;
  }

<<<<<<< Updated upstream
=======
  constructor(private modalController: ModalController, private popoverController: PopoverController, private actionSheetController: ActionSheetController) {
    this.ButtonDisabled=true;
    this.readOnly=true;
   }
  
>>>>>>> Stashed changes
  ngOnInit() {
    this.getClient();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: any) => {
        this.client = client;
      }
    );
    this.clientsService.emitClientSubject();
  }

  getClient() {
    this.clientsService.getClient(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
      }
    );
  }

  ionViewWillLeave() {
    this.ButtonDisabled = true;
    this.readOnly = true;
  }

<<<<<<< Updated upstream
=======
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo de profil',
      buttons: [{
        text: 'Prendre une photo ',
        icon: 'camera-outline',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Sélectionner une photo',
        icon: 'images-outline',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  
>>>>>>> Stashed changes
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponentPage,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (test) => {
<<<<<<< Updated upstream
          if (test == 1) {
            this.readOnly = false;
            this.ButtonDisabled = false;
          } else if (test == 2) {
            console.log("changer image");
=======
          if (test==1) {
            this.readOnly=false;
            this.ButtonDisabled=false;
          } else if (test==2){
            this.presentActionSheet(); 
>>>>>>> Stashed changes
          } else {
            console.log("déconnexion");
          }
          popover.dismiss();
        },
      },
    });
    return await popover.present();
  }

  openPreview(img) {
    this.modalController
      .create({
        component: ProfileImageModalPage,
        componentProps: {
          img: img,
        },
      })
      .then((modal) => modal.present());
  }

  public HidePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = "password";
      this.iconType = "eye-off-outline";
    } else {
      this.passwordShown = true;
      this.passwordType = "text";
      this.iconType = "eye-outline";
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

  ngOnDestroy() {
    this.clientSubscription.unsubscribe();
  }
}
