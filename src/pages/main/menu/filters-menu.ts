import { Component, HostBinding} from '@angular/core';
import { App } from 'ionic-angular';

import { AppManager } from "../../../app/app-manager";

import { UserMenuPage } from '../../../pages/user/user-menu-page';
import { AnalysisTypesPage } from '../../../pages/analysis-types/analysis-types-page';
import { SlideshowPage } from '../../slideshow/slideshow-page';

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
    public selectedFilter: FilterItem;

    /**
     * Lista filtrów znajdujących się w menu filtrów
     */
    get filters(): FilterItem[] {
        return this.dataService.filtersCache;
    }

    constructor(private app: App, private dataService: DataService, private appManager: AppManager) {
        this.extendedMenu = false;
    }
    
	ngOnInit() {}

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
        this.selectedFilter = null;
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
        console.log("filter:", filter);
        if (!this.extendedMenu) this.toggleMenu();
        this.selectedFilter = filter;
        console.log("this.selectedFilter:", this.selectedFilter);
    }

    public showData() {
        if (this.dataService.isRememberedFilters()) {
            this.dataService.saveRememberedFilters();
        }
        this.collapseMenu();
        this.app.getRootNav().push(SlideshowPage);
    }
}