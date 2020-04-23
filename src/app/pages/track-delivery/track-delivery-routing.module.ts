import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackDeliveryPage } from './track-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: TrackDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackDeliveryPageRoutingModule {}
