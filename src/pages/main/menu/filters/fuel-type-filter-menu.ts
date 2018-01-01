import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { FuelTypeFilter } from '../../../../data/menu/fuel-type-filter';

@Component({
    selector: 'samar-menu-filter-fuel-type',
    templateUrl: 'fuel-type-filter-menu.html'
})
export class FuelTypeFilterMenu implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów paliw dostępnych do wyboru dla użytkownika.
     */
    public fuelTypes: FuelTypeFilter[];

    constructor(private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie listy typów paliw</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuFuelTypeFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.fuelTypes = response as FuelTypeFilter[];
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem typów pojazdu do menu filtrów.")
            });
        })

    }

    public validate() {
        let selection: FuelTypeFilter[] = [];
        for (let fuelType of this.fuelTypes) {
            if (fuelType.selected) {
                selection.push(fuelType);
            }
        }
        this.filter.selection = selection;
    }

}