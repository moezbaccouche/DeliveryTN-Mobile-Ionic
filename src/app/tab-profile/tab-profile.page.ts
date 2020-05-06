import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  ModalController,
  PopoverController,
  ActionSheetController,
  ToastController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { ProfileImageModalPage } from "../profile-image-modal/profile-image-modal.page";
import { PopoverComponentPage } from "../popover-component/popover-component.page";
import { Subscription, zip } from "rxjs";
import { Client } from "../models/client.model";
import { ClientsService } from "../services/clients.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { ProductsService } from "../services/products.service";
import { OrdersService } from "../services/orders.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Location } from "../models/location.model";
import { ConfirmUpdateEmailComponent } from "../components/confirm-update-email/confirm-update-email.component";
import { Geolocation } from "@ionic-native/geolocation/ngx";

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
  clientId = 7;

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

  formProfile: FormGroup;
  showForm = false;
  confirmUpdateEmail = false;

  clientImageBase64: string;

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
    private ordersService: OrdersService,
    private router: Router,
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private loadingController: LoadingController
  ) {
    this.ButtonDisabled = true;
    this.readOnly = true;
  }

  ngOnInit() {
    this.getClient();
    this.clientSubscription = this.clientsService.clientSubject.subscribe(
      (client: Client) => {
        this.client = client;
        if (this.client != null)
          this.clientImageBase64 = this.client.imageBase64;
      }
    );
    this.clientsService.emitClientSubject();

    this.getFavoriteProducts();

    this.favoriteProductsSubscription = this.productsService.favoriteProductsSubject.subscribe(
      (favoriteProducts: any[]) => {
        this.nbFavoriteProducts = favoriteProducts.length;
      }
    );
    this.productsService.emitFavoriteProductsSubject();

    this.getTreatedOrders();

    this.treatedOrdersSubscription = this.ordersService.treatedOrdersSubject.subscribe(
      (treatedOrders: any[]) => {
        this.treatedOrders = treatedOrders;
        this.nbDeliveredOrders = this.getNbDeliveredOrders(this.treatedOrders);
      }
    );
    this.ordersService.emitTreatedOrdersSubject();
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
        this.clientImageBase64 = imageData;
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

  getClient() {
    this.clientsService.getClient(this.clientId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
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

  initForm() {
    this.formProfile = this.fb.group({
      firstName: [this.client.firstName, Validators.required],
      lastName: [this.client.lastName, Validators.required],
      dateOfBirth: [this.client.dateOfBirth, Validators.required],
      phone: [
        this.client.phone,
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      email: [this.client.email, [Validators.required, Validators.email]],
      address: [this.client.location.address, Validators.required],
      city: [this.client.location.city, Validators.required],
      zipCode: [this.client.location.zipCode, Validators.required],
    });
  }

  async onSubmit() {
    const firstName = this.formProfile.value.firstName;
    const lastName = this.formProfile.value.lastName;
    const dateOfBirth = this.formProfile.value.dateOfBirth;
    const phone = this.formProfile.value.phone;
    const email = this.formProfile.value.email;
    const address = this.formProfile.value.address;
    const city = this.formProfile.value.city;
    const zipCode = this.formProfile.value.zipCode;
    const long = this.client.location.lat;
    const lat = this.client.location.long;

    const location = new Location(
      this.client.location.id,
      address,
      city,
      zipCode,
      long,
      lat
    );

    if (this.client.imageBase64 != this.clientImageBase64) {
      //This means that the client has updated his profile picture
      this.client.imageBase64 = this.clientImageBase64;
    }

    const editedClient = new Client(
      this.client.id,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      email,
      this.clientImageBase64,
      location
    );

    this.ButtonDisabled = true;
    if (this.client.email != email) {
      //If he answers yes then make the API call, destory the token and redirect him to login page

      //Get The updated position coordinates
      this.onLocateClient();
      this.clientsService.updateClient(editedClient).subscribe(
        (response: Client) => {
          this.client = response;
          this.clientsService.emitClientSubject();
          localStorage.removeItem("token");
          this.presentToast(
            "Votre adresse Email a été modifiée. Veuillez l'activer avant de vous reconnecter !",
            "success"
          );
          this.router.navigate(["/login"]);
        },
        (error) => {
          console.log(error);
          this.presentToast("Une erreur est survenue !", "danger");
        }
      );
    } else {
      //Get The updated position coordinates
      this.onLocateClient();
      this.clientsService.updateClient(editedClient).subscribe(
        (response: Client) => {
          this.client = response;
          this.clientsService.emitClientSubject();
          this.showForm = false;
          this.presentToast(
            "Votre profil a été modifié avec succès !",
            "success"
          );
        },
        (error) => {
          console.log(error);
          this.presentToast("Une erreur est survenue !", "danger");
        }
      );
    }
  }

  async onLocateClient() {
    let loader = await this.loadingController.create({
      message: "Recherche de votre position…",
    });
    loader.present();
    this.geolocation.getCurrentPosition().then(
      (response) => {
        loader.dismiss();
        this.client.location.lat = response.coords.latitude;
        this.client.location.long = response.coords.longitude;
      },
      (error) => {
        console.log(error);
        this.presentToast("Impossible de trouver votre position !", "danger");
      }
    );
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
            if (this.showForm) {
              this.readOnly = true;
              this.ButtonDisabled = true;
              this.showForm = false;
            } else {
              this.readOnly = false;
              this.ButtonDisabled = false;
              this.showForm = true;
              this.initForm();
            }
          } else if (test == 2) {
            this.presentActionSheet();
          } else if (test == 3) {
            //Logout
            localStorage.removeItem("token");
            this.router.navigate(["/login"]);
            console.log("déconnexion");
          }
          popover.dismiss();
        },
      },
    });
    return await popover.present();
  }

  async presentPopoverConfirmUpdateEmail() {
    const popover = await this.popoverController.create({
      component: ConfirmUpdateEmailComponent,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer) {
            //Means that the client really wants to change his email address
            console.log(answer);
            this.confirmUpdateEmail = true;
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
