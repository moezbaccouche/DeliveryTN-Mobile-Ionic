import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientsService } from "../services/clients.service";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  authenticationFailed: string = "";

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") != null) {
      this.router.navigate([""]);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    var clientCredentials = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    };
    console.log(clientCredentials);

    this.clientsService.login(clientCredentials).subscribe(
      (response: any) => {
        localStorage.setItem("token", response.token);
        this.router.navigate([""]);
      },
      (err) => {
        console.log(err);
        if (err.status == 400) {
          this.authenticationFailed = err.error.message;
        } else {
          this.presentToast("Une erreur est survenue !", "danger");
        }
      }
    );
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
