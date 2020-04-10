import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PopoverOrderbyComponent } from "./menus/popover-orderby/popover-orderby.component";
import { PopoverAmountComponent } from "./menus/popover-amount/popover-amount.component";
import { Tab1Page } from "./tab1/tab1.page";
import { ProfileImageModalPageModule } from './profile-image-modal/profile-image-modal.module';

@NgModule({
  declarations: [AppComponent, PopoverOrderbyComponent, PopoverAmountComponent],
  entryComponents: [PopoverOrderbyComponent, PopoverAmountComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ProfileImageModalPageModule
  ],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    Tab1Page,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
