import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientsService } from "src/app/services/clients.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  formModel: FormGroup;
  emailSent = false;
  submittingForm = false;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formModel = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const resetEmail = {
      email: this.formModel.value.email,
    };
    this.submittingForm = true;

    this.clientsService.resetPassword(resetEmail).subscribe(
      (response: any) => {
        this.emailSent = true;
        this.submittingForm = false;
      },
      (error) => {
        this.presentToast("Une erreur est survenue !", "danger");
        console.log(error);
        this.submittingForm = false;
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
