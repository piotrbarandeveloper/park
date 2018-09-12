import { Component, Input, OnInit, Inject, forwardRef} from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';
import { Date as DateOptions} from '../../../data/menu/date';


@Component({
    selector: 'samar-filter-date',
    templateUrl: 'date-filter.html'
})
export class DateFilter implements OnInit {

    @Input()
    filter: FilterItem;

    /**
     * Zakres lat dostępnych użytkownikowi.
     */
    public item: DateOptions;

    /**
     * Wartośc wybrana przez użytkownika
     */
    public selectedDate: {year: number, month: number};

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {}

    ngOnInit() {
        this.loadData();
    }

    public years: number[];

    public months: number[];

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie kalendarza</div>
            </div>`
        });

        loading.present().then(() => {

            this.dataService.menuDateFilter(this.filtersMenu.filters).subscribe(response => {
                this.selectedDate = {
                    year: this.filter.selection.year,
                    month: this.filter.selection.month
                };

                this.item = response[0] as DateOptions;

                console.log("this.selectedDate:", this.selectedDate);
                this.months = [];
                for (let month = this.item.fromMonth; month < 12; month++) {
                    this.months.push(month);
                }
                console.log("this.months:", this.months);

                this.years = [];
                for (let year = this.item.fromYear; year <= this.item.toYear; year++) {
                    this.years.push(year);
                }
                console.log("this.years:", this.years);


                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem danych dla filtru daty.")
            });
        })

    }

    selectMonth(month: number) {
        this.selectedDate.month = month;
        this.filter.selection = this.selectedDate;
    }

    selectYear(year: number) {
        if (year == this.item.toYear && this.selectedDate.month > this.item.toMonth) {
            this.selectedDate.month = this.item.toMonth;
        }
        this.selectedDate.year = year;
        this.filter.selection = this.selectedDate;
    }
}