import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileImageModalPageRoutingModule } from './profile-image-modal-routing.module';

import { ProfileImageModalPage } from './profile-image-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileImageModalPageRoutingModule
  ],
  declarations: [ProfileImageModalPage]
})
export class ProfileImageModalPageModule {}
