import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./pages/cart/cart.module").then((m) => m.CartPageModule),
  },
  {
    path: "products-by-category/:id",
    loadChildren: () =>
      import("./pages/products-by-category/products-by-category.module").then(
        (m) => m.ProductsByCategoryPageModule
      ),
  },  {
    path: 'profile-image-modal',
    loadChildren: () => import('./profile-image-modal/profile-image-modal.module').then( m => m.ProfileImageModalPageModule)
  },
  {
    path: 'popover-component',
    loadChildren: () => import('./popover-component/popover-component.module').then( m => m.PopoverComponentPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
