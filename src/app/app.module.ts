import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PopoverOrderbyComponent } from "./menus/popover-orderby/popover-orderby.component";
import { PopoverAmountComponent } from "./menus/popover-amount/popover-amount.component";
import { Tab1Page } from "./tab1/tab1.page";
import { ProfileImageModalPageModule } from "./profile-image-modal/profile-image-modal.module";
import { PopoverConfirmDeleteComponent } from "./menus/popover-confirm-delete/popover-confirm-delete.component";
import { PopoverComponentPageModule } from "./popover-component/popover-component.module";
import { ProductsService } from "./services/products.service";
import { CategoriesService } from "./services/categories.service";
import { PopoverConfirmEmptyCartComponent } from "./menus/popover-confirm-empty-cart/popover-confirm-empty-cart.component";
import { EditDeliveryAddressPopoverComponent } from "./menus/edit-delivery-address-popover/edit-delivery-address-popover.component";
import { OrdersService } from "./services/orders.service";
import { ClientsService } from "./services/clients.service";
import { ProductImagesSlidesComponent } from "./components/product-images-slides/product-images-slides.component";
import { File } from "@ionic-native/file/ngx";
import { Camera } from "@ionic-native/Camera/ngx";
import { PopoverRatingComponent } from "./components/popover-rating/popover-rating.component";
import { PopoverDeliverymanProfileComponent } from "./components/popover-deliveryman-profile/popover-deliveryman-profile.component";
import { DeliveryMenService } from "./services/deliveryMen.service";
import { PopoverRequestBillComponent } from "./components/popover-request-bill/popover-request-bill.component";
import { PopoverContactDeliveryManComponent } from "./components/popover-contact-delivery-man/popover-contact-delivery-man.component";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AuthInterceptor } from "./auth/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    PopoverOrderbyComponent,
    PopoverAmountComponent,
    PopoverConfirmDeleteComponent,
    PopoverConfirmEmptyCartComponent,
    EditDeliveryAddressPopoverComponent,
    ProductImagesSlidesComponent,
    PopoverRatingComponent,
    PopoverDeliverymanProfileComponent,
    PopoverRequestBillComponent,
    PopoverContactDeliveryManComponent,
  ],
  entryComponents: [
    PopoverOrderbyComponent,
    PopoverAmountComponent,
    PopoverConfirmDeleteComponent,
    PopoverConfirmEmptyCartComponent,
    EditDeliveryAddressPopoverComponent,
    ProductImagesSlidesComponent,
    PopoverRatingComponent,
    PopoverDeliverymanProfileComponent,
    PopoverRequestBillComponent,
    PopoverContactDeliveryManComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileImageModalPageModule,
    PopoverComponentPageModule,
  ],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    Tab1Page,
    ProductsService,
    CategoriesService,
    OrdersService,
    ClientsService,
    DeliveryMenService,
    Camera,
    File,
    CallNumber,
    SMS,
    Geolocation,
    //The following line makes a token check for all the services requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
