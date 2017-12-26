import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppManager } from "../../app/app-manager";

import { RestService } from "../../data/service/rest-service";
import { AnalysisTypesPage } from '../analysis-types/analysis-types-page';
import { UserMenuPage } from '../user/user-menu-page';

@Component({
    selector: 'samar-main-page',
    templateUrl: 'main-page.html'
})
export class MainPage {

    public signedIn: boolean;

    public spinnerVisible: boolean;
  
    constructor(private appManager: AppManager, public navCtrl: NavController, private restService: RestService) {
        this.restService.signIn().subscribe(user => {
            if (user) {
                this.signedIn = true;
            }
        }, error => this.appManager.errorHandler.handle(error));
  }


}
