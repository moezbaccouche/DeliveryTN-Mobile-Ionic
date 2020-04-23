import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackDeliveryPageRoutingModule } from './track-delivery-routing.module';

import { TrackDeliveryPage } from './track-delivery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackDeliveryPageRoutingModule
  ],
  declarations: [TrackDeliveryPage]
})
export class TrackDeliveryPageModule {}
