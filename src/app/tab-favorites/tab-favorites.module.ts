import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { TabFavoritesPage } from "./tab-favorites.page";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: TabFavoritesPage }]),
  ],
  declarations: [TabFavoritesPage],
})
export class TabFavoritesPageModule {}
