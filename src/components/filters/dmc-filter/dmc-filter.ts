import { Component, Input, OnInit, forwardRef, Inject} from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { DMC } from '../../../data/menu/dmc';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

export interface RangeValue {
    lower?: number;
    upper?: number;
}

@Component({
    selector: 'samar-filter-dmc',
    templateUrl: 'dmc-filter.html'
})
export class DMCFilter implements OnInit {

    @Input()
    filter: FilterItem;

    /**
     * Zakres dat dostępnych do wyboru dla użytkownika.
     */
    public options: DMC;

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
            if (this.filter.selection) {
                this.range.lower = this.filter.selection.from;
                this.range.upper = this.filter.selection.to;
            }

            this.dataService.menuDMCFilter(this.filtersMenu.filters).subscribe(response => {
                this.options = response[0] as DMC;
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem danych dla filtru daty.")
            });
        })

    }

    public validate() {
        this.filter.selection.from = this.range.lower;
        this.filter.selection.to = this.range.upper;
    }
}