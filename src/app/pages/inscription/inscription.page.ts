import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  LoadingController,
  ToastController,
  PopoverController,
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ClientsService } from "src/app/services/clients.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { defaultAvatarBase64 } from "../../../assets/defaultAvatarBase64";
import { Router } from "@angular/router";
import { PopoverMapLocationComponent } from "src/app/components/popover-map-location/popover-map-location.component";

@Component({
  selector: "app-inscription",
  templateUrl: "./inscription.page.html",
  styleUrls: ["./inscription.page.scss"],
})
export class InscriptionPage implements OnInit {
  passwordType: string = "password";
  iconType: string = "eye-off-outline";
  passwordShown: boolean = false;
  currentImage = "../../assets/defaultAvatar.jpg";

  formModel: FormGroup;
  lat = null;
  long = null;
  sendingForm = false;
  emailExists = false;
  imageBase64String: string;

  registerDone = false;
  clientEmail = "";

  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  async pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    let loader = await this.loadingController.create({
      message: "Chargement de l'image…",
    });

    this.camera.getPicture(options).then(
      (imageData) => {
        loader.present();
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.currentImage = "data:image/jpeg;base64," + imageData;
        loader.dismiss();
        this.imageBase64String = imageData;
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

  async locateClient() {
    // let loader = await this.loadingController.create({
    //   message: "Recherche de votre position…",
    // });
    // loader.present();
    // this.geolocation.getCurrentPosition().then(
    //   (response) => {
    //     loader.dismiss();
    //     this.lat = response.coords.latitude;
    //     this.long = response.coords.longitude;
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.presentToast("Impossible de trouver votre position !", "danger");
    //   }
    // );
  }

  initForm() {
    this.formModel = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]],
      phone: ["", [Validators.required, Validators.minLength(8)]],
      city: ["", Validators.required],
      address: ["", Validators.required],
      zipCode: ["", Validators.required],
    });
  }

  onSubmit() {
    console.log(this.currentImage);
    var clientImage = defaultAvatarBase64;
    if (this.currentImage != "../../assets/defaultAvatar.jpg") {
      console.log("here");
      clientImage = this.imageBase64String;
    }

    var newClient = {
      firstName: this.formModel.value.firstName,
      lastName: this.formModel.value.lastName,
      phone: this.formModel.value.phone,
      email: this.formModel.value.email,
      password: this.formModel.value.password,
      ImageBase64String: clientImage,
      dateOfBirth: this.formModel.value.dateOfBirth,
      location: {
        city: this.formModel.value.city,
        zipCode: this.formModel.value.zipCode,
        address: this.formModel.value.address,
        lat: this.lat,
        long: this.long,
      },
    };

    this.clientEmail = this.formModel.value.email;

    this.sendingForm = true;

    this.clientsService.register(newClient).subscribe(
      (response: any) => {
        if (response.succeeded) {
          this.presentToast(
            "Inscription réussie ! Un Email de confirmation vous a été envoyé.",
            "success"
          );
          this.emailExists = false;
          this.registerDone = true;
          //this.router.navigate(["/login"]);
        } else {
          response.errors.forEach((err) => {
            switch (err.error.code) {
              case "DuplicatedEmail":
                this.emailExists = true;
                break;

              default:
                this.presentToast(err.code, "danger");
                break;
            }
          });
        }
        this.sendingForm = false;
      },
      (err) => {
        if (err.error.code == "DuplicatedEmail") {
          this.emailExists = true;
        } else {
          this.presentToast("Un problème est survenue !", "danger");
        }

        this.sendingForm = false;
        console.log(err);
      }
    );
  }

  onResendEmail() {
    this.clientsService
      .resendVerificationEmail({ email: this.clientEmail })
      .subscribe(
        () => {
          this.presentToast("Email de vérification renvoyée !", "success");
        },
        (error) => {
          this.presentToast("Un problème est survenue !", "danger");
        }
      );
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }

  async presentPopoverMap(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverMapLocationComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (lat, long) => {
          console.log(lat);
          console.log(long);
          this.lat = lat;
          this.long = long;
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }
}
