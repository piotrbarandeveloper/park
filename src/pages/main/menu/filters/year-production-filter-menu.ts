import { Component, Input, OnInit} from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { YearProductionFilter } from '../../../../data/menu/year-production-filter';

@Component({
    selector: 'samar-menu-filter-year-production',
    templateUrl: 'year-production-filter-menu.html'
})
export class YearProductionFilterMenu implements OnInit {

    @Input()
    filter: FilterItem;

    /**
     * Zakres dat dostępnych do wyboru dla użytkownika.
     */
    public options: YearProductionFilter;

    /**
     * Wartośc wybrana przez użytkownika
     */
    public date: string;

    constructor(private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {}

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie zakresu danych</div>
            </div>`
        });

        loading.present().then(() => {
            if (this.filter.selection) {
                this.date = this.filter.selection.year + '-01-01';
            }

            this.dataService.menuYearProductionFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.options = response[0] as YearProductionFilter;
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem danych dla filtru daty.")
            });
        })

    }

    public validate() {
        let date = new Date(this.date);
        this.filter.selection.year = date.getFullYear();
        //this.dataService.updateFilterMenu(this.filter);
        console.log("update selection:", this.filter.selection.year);
    }
}