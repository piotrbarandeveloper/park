import { Component } from "@angular/core";

@Component({
    templateUrl: "user-menu-page.html",
    selector: "samar-user-menu-page"
})
export class UserMenuPage {

    public spinnerVisible: boolean;

    constructor() {
        this.spinnerVisible = true;
    }
    
    public ionViewDidLoad() {
        this.spinnerVisible = false;
    }
}