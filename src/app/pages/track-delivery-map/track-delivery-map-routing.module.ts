import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackDeliveryMapPage } from './track-delivery-map.page';

const routes: Routes = [
  {
    path: '',
    component: TrackDeliveryMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackDeliveryMapPageRoutingModule {}
