import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AppComponent } from './app.component';

import { CollapsibleListModule } from "../components/collapsible-list";

import { MainPage } from '../pages/main/main-page';
import { SignInPage } from "../pages/user/sign-in-page";
import { SlideshowPage } from "../pages/slideshow/slideshow-page";
import { ChartPage } from "../pages/slideshow/chart/chart-page";
import { AnalysisTypesPage } from '../pages/analysis-types/analysis-types-page';
import { UserMenuPage } from '../pages/user/user-menu-page';

import { FiltersMenu } from "../pages/main/menu/filters-menu";

import { YearProductionFilter } from "../components/filters/year-production-filter/year-production-filter";
import { RegionFilter } from "../components/filters/region-filter/region-filter";
import { VehicleTypeFilter } from "../components/filters/vehicle-type-filter/vehicle-type-filter";
import { FuelTypeFilter } from "../components/filters/fuel-type-filter/fuel-type-filter";
import { CustomerTypeFilter } from "../components/filters/customer-type-filter/customer-type-filter";
import { DMCFilter } from "../components/filters/dmc-filter/dmc-filter";
import { MakeFilter } from "../components/filters/make-filter/make-filter";
import { SegmentationFilter } from "../components/filters/segmentation-filter/segmentation-filter";
import { SegmentItemEditor } from '../components/filters/segmentation-filter/segment-item-editor';

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
    ChartPage,
    AnalysisTypesPage,
    UserMenuPage,
    SelectionFilterMenuPipe,

    FiltersMenu,
    YearProductionFilter,
    RegionFilter,
    VehicleTypeFilter,
    FuelTypeFilter,
    CustomerTypeFilter,
    DMCFilter,
    MakeFilter,
    SegmentationFilter,
    SegmentItemEditor,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(AppComponent),
    CollapsibleListModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    MainPage,
    SignInPage,
    SlideshowPage,
    ChartPage,
    AnalysisTypesPage,
    UserMenuPage,

    FiltersMenu,
    YearProductionFilter,
    RegionFilter,
    VehicleTypeFilter,
    FuelTypeFilter,
    CustomerTypeFilter,
    DMCFilter,
    MakeFilter,
    SegmentationFilter,
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
