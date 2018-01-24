import { Component } from "@angular/core";

import { RestService as DataService } from "../../data";

@Component({
    templateUrl: "user-menu-page.html",
    selector: "samar-user-menu-page"
})
export class UserMenuPage {

    public spinnerVisible: boolean;

    public rememberFilters: boolean;

    constructor(private dataService: DataService) {
        this.spinnerVisible = true;
    }
    
    public ionViewDidLoad() {
        this.spinnerVisible = false;
        this.rememberFilters = this.dataService.isRememberedFilters();
    }

    public changeRememberedFilters() {
        if (this.rememberFilters) {
            this.dataService.saveRememberedFilters();
        } else {
            this.dataService.deleteRememberedFilters();
        }
    }
}