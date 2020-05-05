import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ClientsService } from "src/app/services/clients.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { defaultAvatarBase64 } from "../../../assets/defaultAvatarBase64";
import { Router } from "@angular/router";

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

  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
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
    let loader = await this.loadingController.create({
      message: "Recherche de votre position…",
    });
    loader.present();
    this.geolocation.getCurrentPosition().then(
      (response) => {
        loader.dismiss();
        this.lat = response.coords.latitude;
        this.long = response.coords.longitude;
      },
      (error) => {
        console.log(error);
        this.presentToast("Impossible de trouver votre position !", "danger");
      }
    );
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
      clientImage = this.currentImage;
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

    this.clientsService.register(newClient).subscribe(
      (response: any) => {
        console.log(response);
        if (response.succeeded) {
          this.presentToast(
            "Inscription réussie ! Un Email de confirmation vous a été envoyé.",
            "success"
          );
          this.router.navigate(["/login"]);
        } else {
          response.errors.forEach((err) => {
            switch (err.code) {
              case "DuplicateUserName":
                this.emailExists = true;
                break;

              default:
                this.presentToast(err.code, "danger");
                break;
            }
          });
        }
      },
      (error) => {
        this.presentToast("Un problème est survenue !", "danger");
        console.log(error);
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
}
