import { Component} from '@angular/core';
import { App } from 'ionic-angular';

import { AppManager } from "../../../app/app-manager";

import { UserMenuPage } from '../../../pages/user/user-menu-page';
import { AnalysisTypesPage } from '../../../pages/analysis-types/analysis-types-page';

import { RestService } from '../../../data/service/rest-service';
import { FilterItem } from '../../../data/filter-item';

@Component({
    selector: 'samar-main-filters-menu',
    templateUrl: 'filters-menu.html'
})
export class FiltersMenu {

    constructor(private app: App, private restService: RestService, private appManager: AppManager) {
	}
	ngOnInit() {
        //pobieramy dostępne filtry, do metodu nginit aby jak najszybciej załadowac filtry
		this.loadFilters();
    }

    private filters: FilterItem[];

    private loadFilters() {
        this.restService.filters().subscribe(filters => {
            this.filters = filters;
            console.log("filters:", filters);
		}, error => this.appManager.errorHandler.show(error));
    }

    private showAnalysisPanel() {
        this.app.getRootNav().push(AnalysisTypesPage);
    }

    private showUserPanel() {
        this.app.getRootNav().push(UserMenuPage);
    }
}