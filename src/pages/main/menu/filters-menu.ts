import { Component, HostBinding} from '@angular/core';
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

    /**
     * Parametr mowiacy czy menu jest rozszerzony do widoku z informacja o filtrach
     */
    @HostBinding('class.extended') 
    private extendedMenu: boolean;

    /**
     * Wybrany przez użytkownika filtr z menu.
     */
    private selectedFitler: FilterItem;

    /**
     * Lista filtrów znajdujących się w menu filtrów
     */
    private filters: FilterItem[];

    constructor(private app: App, private restService: RestService, private appManager: AppManager) {
        this.extendedMenu = false;
    }
    
	ngOnInit() {
        //pobieramy dostępne filtry, do metodu nginit aby jak najszybciej załadowac filtry
		this.loadFilters();
    }

    /**
     * Ładujemy filtry dla wybranej analizy
     */
    private loadFilters() {
        this.restService.filters(/*przekazać typ analizy*/).subscribe(filters => {
            this.filters = filters;
            console.log("filters:", filters);
		}, error => this.appManager.errorHandler.show(error));
    }

    /**
     * Pokaż panel analizy
     */
    private showAnalysisPanel() {
        this.app.getRootNav().push(AnalysisTypesPage);
    }

    /**
     * Pokaż panel użytkownika
     */
    private showUserPanel() {
        this.app.getRootNav().push(UserMenuPage);
    }

    /**
     * Zwiń/rozwiń menu filtrów
     */
    public toggleMenu() {
        this.extendedMenu = !this.extendedMenu;
    }

}