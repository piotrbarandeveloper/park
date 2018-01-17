import { Component, HostBinding} from '@angular/core';
import { App } from 'ionic-angular';

import { AppManager } from "../../../app/app-manager";

import { UserMenuPage } from '../../../pages/user/user-menu-page';
import { AnalysisTypesPage } from '../../../pages/analysis-types/analysis-types-page';

import { RestService as DataService} from '../../../data/service/rest-service';
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
    @HostBinding('class.show-panel-filter') 
    public selectedFitler: FilterItem;

    /**
     * Lista filtrów znajdujących się w menu filtrów
     */
    private _filters: FilterItem[];

    get filters(): FilterItem[] {
        return this._filters;
    }

    set filters(filters: FilterItem[])  {
        this._filters = filters;
    }

    constructor(private app: App, private dataService: DataService, private appManager: AppManager) {
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
        this.dataService.filters(/*przekazać stan menu w raz z wybrana analiza o ile jest*/).subscribe(filters => {
            this.filters = filters;
		}, error => this.appManager.errorHandler.show(error));
    }

    /**
     * Pokaż panel analizy
     */
    private showAnalysisPanel() {
        this.collapseMenu();
        this.app.getRootNav().push(AnalysisTypesPage);
    }

    /**
     * Pokaż panel użytkownika
     */
    private showUserPanel() {
        this.collapseMenu();
        this.app.getRootNav().push(UserMenuPage);
    }

    /**
     * Zwijanie menu do stanu początkowego czyszczac przy tym wybrany filtr.
     */
    private collapseMenu() {
        this.extendedMenu = false;
        this.selectedFitler = null;
    }

    /**
     * Zwiń/rozwiń menu filtrów
     */
    public toggleMenu() {
        this.extendedMenu = !this.extendedMenu;
        if (!this.extendedMenu) {
            this.collapseMenu();
        }
    }

    /**
     * Wybierz dany filtr
     */
    public selectFilter(filter: FilterItem) {
        if (!this.extendedMenu) this.toggleMenu();
        this.selectedFitler = filter;
    }
}