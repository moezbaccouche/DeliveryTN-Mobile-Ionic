import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  ModalController,
  PopoverController,
  ActionSheetController,
  ToastController,
  NavController,
} from "@ionic/angular";
import { ProfileImageModalPage } from "../profile-image-modal/profile-image-modal.page";
import { PopoverComponentPage } from "../popover-component/popover-component.page";
import { Subscription } from "rxjs";
import { Client } from "../models/client.model";
import { ClientsService } from "../services/clients.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { ProductsService } from "../services/products.service";
import { OrdersService } from "../services/orders.service";

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

  nbFavoriteProducts = 0;
  favoriteProducts: any;
  favoriteProductsSubscription: Subscription;

  nbDeliveredOrders = 0;
  treatedOrders: any;
  treatedOrdersSubscription: Subscription;

  isLoading = true;

  currentImage = "../../assets/me.png";

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private clientsService: ClientsService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) {
    this.ButtonDisabled = true;
    this.readOnly = true;
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.currentImage = "data:image/jpeg;base64," + imageData;
      },
      (err) => {
        // Handle error
        console.log("Camera issue:" + err);
      }
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Photo de profil",
      buttons: [
        {
          text: "Prendre une photo ",
          icon: "camera-outline",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Sélectionner une photo",
          icon: "images-outline",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Annuler",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  ngOnInit() {
    this.getClient();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: any) => {
        this.client = client;
      }
    );
    this.clientsService.emitClientSubject();

    this.getFavoriteProducts();

    this.favoriteProductsSubscription = this.productsService.favoriteProductsSubject.subscribe(
      (favoriteProducts: any[]) => {
        this.nbFavoriteProducts = favoriteProducts.length;
        console.log(this.nbFavoriteProducts);
      }
    );
    this.productsService.emitFavoriteProductsSubject();

    this.getTreatedOrders();

    this.treatedOrdersSubscription = this.ordersService.treatedOrdersSubject.subscribe(
      (treatedOrders: any[]) => {
        this.treatedOrders = treatedOrders;
        this.nbDeliveredOrders = this.getNbDeliveredOrders(this.treatedOrders);
        console.log(this.nbDeliveredOrders);
      }
    );
    this.ordersService.emitTreatedOrdersSubject();
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

  getTreatedOrders() {
    this.ordersService.getTreatedOrders(this.clientId).then(
      (response) => {
        this.treatedOrders = response;
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
      }
    );
  }

  getFavoriteProducts() {
    this.productsService.getFavoriteProductsFromApi(this.clientId).then(
      () => {},
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
      }
    );
  }

  getNbDeliveredOrders(treatedOrders) {
    let nb = 0;
    for (let i = 0; i < treatedOrders.length; i++) {
      if (treatedOrders[i].orderStatus == 2) {
        nb++;
      }
    }
    return nb;
  }

  ionViewWillLeave() {
    this.ButtonDisabled = true;
    this.readOnly = true;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponentPage,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (test) => {
          if (test == 1) {
            this.readOnly = false;
            this.ButtonDisabled = false;
          } else if (test == 2) {
            this.presentActionSheet();
          } else {
            this.navCtrl.navigateForward('inscription');
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
    this.favoriteProductsSubscription.unsubscribe();
    this.treatedOrdersSubscription.unsubscribe();
  }
}
