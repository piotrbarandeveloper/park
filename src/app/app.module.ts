import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AppComponent } from './app.component';
import { MainPage } from '../pages/main/main-page';
import { SignInPage } from "../pages/user/sign-in-page";
import { SlideshowPage } from "../pages/slideshow/slideshow-page";
import { AnalysisTypesPage } from '../pages/analysis-types/analysis-types-page';
import { UserMenuPage } from '../pages/user/user-menu-page';

import { FiltersMenu } from "../pages/main/menu/filters-menu";
import { YearProductionFilterMenu } from "../pages/main/menu/filters/year-production-filter-menu";
import { RegionFilterMenu } from "../pages/main/menu/filters/region-filter-menu";

import { SelectionFilterMenuPipe } from '../pipe/selection-filter-menu-pipe';


import { RestService } from "../data/service/rest-service";
import { AppManager } from "./app-manager";
import { AppErrorHandler } from "./app-error-handler";

@NgModule({
  declarations: [
    AppComponent,
    MainPage,
    SignInPage,
    SlideshowPage,
    AnalysisTypesPage,
    UserMenuPage,
    SelectionFilterMenuPipe,

    FiltersMenu,
    YearProductionFilterMenu,
    RegionFilterMenu,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    MainPage,
    SignInPage,
    SlideshowPage,
    AnalysisTypesPage,
    UserMenuPage,

    FiltersMenu,
    YearProductionFilterMenu,
    RegionFilterMenu,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestService,
    AppErrorHandler,
    AppManager
  ]
})
export class AppModule {}
