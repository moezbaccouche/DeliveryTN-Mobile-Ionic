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
  },
  {
    path: "profile-image-modal",
    loadChildren: () =>
      import("./profile-image-modal/profile-image-modal.module").then(
        (m) => m.ProfileImageModalPageModule
      ),
  },
  {
    path: "popover-component",
    loadChildren: () =>
      import("./popover-component/popover-component.module").then(
        (m) => m.PopoverComponentPageModule
      ),
  },
  {
    path: "product-details/:id",
    loadChildren: () =>
      import("./pages/product-details/product-details.module").then(
        (m) => m.ProductDetailsPageModule
      ),
  },
  {
    path: "inscription",
    loadChildren: () =>
      import("./pages/inscription/inscription.module").then(
        (m) => m.InscriptionPageModule
      ),
  },
  {
    path: "order-details/:id",
    loadChildren: () =>
      import("./pages/order-details/order-details.module").then(
        (m) => m.OrderDetailsPageModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "track-delivery/:orderId",
    loadChildren: () =>
      import("./pages/track-delivery/track-delivery.module").then(
        (m) => m.TrackDeliveryPageModule
      ),
  },  {
    path: 'track-delivery-map',
    loadChildren: () => import('./pages/track-delivery-map/track-delivery-map.module').then( m => m.TrackDeliveryMapPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
