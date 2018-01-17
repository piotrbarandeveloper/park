import { Component, Input, OnInit, Inject, forwardRef} from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { YearProduction } from '../../../data/menu/year-production';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

export interface RangeValue {
    lower?: number;
    upper?: number;
}

@Component({
    selector: 'samar-filter-year-production',
    templateUrl: 'year-production-filter.html'
})
export class YearProductionFilter implements OnInit {

    @Input()
    filter: FilterItem;

    /**
     * Zakres dat dostępnych do wyboru dla użytkownika.
     */
    public item: YearProduction;

    /**
     * Wartośc wybrana przez użytkownika
     */
    public range: RangeValue = {};

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {}

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

            this.dataService.menuYearProductionFilter(this.filtersMenu.filters).subscribe(response => {
                this.item = response[0] as YearProduction;
                this.range.lower = this.filter.selection.start;
                this.range.upper = this.filter.selection.end;
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem danych dla filtru daty.")
            });
        })

    }

    public validate() {
        this.filter.selection.start = this.range.lower;
        this.filter.selection.end = this.range.upper;
    }
}