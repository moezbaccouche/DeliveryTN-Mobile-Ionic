import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileImageModalPage } from '../profile-image-modal/profile-image-modal.page';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit {
  
  passwordType : string = 'password';
  iconType : string = 'eye-off-outline';
  passwordShown : boolean = false;

  nomImage : string = 'me';

  constructor(private modalController: ModalController) { 

  }

  openPreview(img) {
    this.modalController.create({
      component: ProfileImageModalPage,
      componentProps: {
        img: img
      }
    }).then(modal => modal.present());
  }

  public HidePassword() {
    if(this.passwordShown) {
      this.passwordShown=false;
      this.passwordType = 'password';
      this.iconType='eye-off-outline';
    } else {
      this.passwordShown=true;
      this.passwordType='text';
      this.iconType='eye-outline';
    }
  }

  ngOnInit() {
  }

}
