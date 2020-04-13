import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverComponentPage } from './popover-component.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverComponentPageRoutingModule {}
