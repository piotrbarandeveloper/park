import { Component, Input, OnInit, ViewChild, forwardRef, Inject} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { FuelType } from '../../../data/menu/fuel-type';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-fuel-type',
    templateUrl: 'fuel-type-filter.html'
})
export class FuelTypeFilter implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów paliw dostępnych do wyboru dla użytkownika.
     */
    private fuelTypes: FuelType[];

    public items: FuelTypeWrapper[];

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
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
            this.dataService.menuFuelTypeFilter(this.filtersMenu.filters).subscribe(response => {
                this.fuelTypes = response as FuelType[];
                this.buildItems();
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem typów pojazdu do menu filtrów.")
            });
        })

    }

    public validate() {
        let selection = [];
        for (let fuelType of this.items) {
            if (fuelType.selected) {
                selection.push({"id": fuelType.id, "name": fuelType.name});
            }
        }
        this.filter.selection = selection;
    }
    
    private buildItems() {
        this.items = [];

        for (let fuelType of this.fuelTypes) {
            let fuelTypeWrapper = new FuelTypeWrapper(fuelType, fuelType.selected);
            this.items.push(fuelTypeWrapper);
        }
    }

}

export class FuelTypeWrapper {

	constructor(public fuelType: FuelType, public selected: boolean) {
	}

	public get id() {
		return this.fuelType.id;
	}

	public get name() {
		return this.fuelType.name;
	}

}