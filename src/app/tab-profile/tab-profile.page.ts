import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ProfileImageModalPage } from '../profile-image-modal/profile-image-modal.page';
import { PopoverComponentPage } from '../popover-component/popover-component.page';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit {
  
  passwordType : string = 'password';
  iconType : string = 'eye-off-outline';
  passwordShown : boolean = false;
  ButtonDisabled : boolean ;
  readOnly : boolean ;

  nomImage : string = 'me';

  constructor(private modalController: ModalController, private popoverController: PopoverController) {
    this.ButtonDisabled=true;
    this.readOnly=true;
   }
  
  ngOnInit() {
  
  }

  ionViewWillLeave() {
    this.ButtonDisabled=true;
    this.readOnly=true;
  }
  
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponentPage,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (test) => {
          if (test==1) {
            this.readOnly=false;
            this.ButtonDisabled=false;
          } else if (test==2){
            console.log("changer image");
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

 

}
