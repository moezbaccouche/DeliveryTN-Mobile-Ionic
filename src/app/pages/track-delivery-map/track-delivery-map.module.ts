import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackDeliveryMapPageRoutingModule } from './track-delivery-map-routing.module';

import { TrackDeliveryMapPage } from './track-delivery-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackDeliveryMapPageRoutingModule
  ],
  declarations: [TrackDeliveryMapPage]
})
export class TrackDeliveryMapPageModule {}
