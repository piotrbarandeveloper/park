import { Component, Input, OnInit} from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { DMCFilter } from '../../../../data/menu/dmc-filter';

export interface RangeValue {
    lower?: number;
    upper?: number;
}

@Component({
    selector: 'samar-menu-filter-dmc',
    templateUrl: 'dmc-filter-menu.html'
})
export class DMCFilterMenu implements OnInit {

    @Input()
    filter: FilterItem;

    /**
     * Zakres dat dostępnych do wyboru dla użytkownika.
     */
    public options: DMCFilter;

    /**
     * Wartośc wybrana przez użytkownika
     */
    public range: RangeValue = {};

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
                this.range.lower = this.filter.selection.from;
                this.range.upper = this.filter.selection.to;
            }

            this.dataService.menuDMCFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.options = response[0] as DMCFilter;
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