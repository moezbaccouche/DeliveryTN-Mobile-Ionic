import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileImageModalPage } from './profile-image-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileImageModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileImageModalPageRoutingModule {}
