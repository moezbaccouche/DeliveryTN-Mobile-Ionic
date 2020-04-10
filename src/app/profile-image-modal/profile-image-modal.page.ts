import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-image-modal',
  templateUrl: './profile-image-modal.page.html',
  styleUrls: ['./profile-image-modal.page.scss'],
})
export class ProfileImageModalPage implements OnInit {
  
  img: any;

  sliderOpts = {
    zoom: {
      maxRatio: 3
    }
  };

  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('img');
  }

 

  

  close() {
    this.modalController.dismiss();
  }

}
