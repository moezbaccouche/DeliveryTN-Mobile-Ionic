import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverComponentPageRoutingModule } from './popover-component-routing.module';

import { PopoverComponentPage } from './popover-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverComponentPageRoutingModule
  ],
  declarations: [PopoverComponentPage]
})
export class PopoverComponentPageModule {}
