import { Component, Input, OnInit, ViewChild, forwardRef, Inject} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { VehicleType } from '../../../data/menu/vehicle-type';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-vehicle-type',
    templateUrl: 'vehicle-type-filter.html'
})
export class VehicleTypeFilter implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów pojazdów dostępnych do wyboru dla użytkownika.
     */
    private vehicleTypes: VehicleType[];

    public items: VehicleTypeWrapper[];

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie listy typów pojazdu</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuVehicleTypeFilter(this.filtersMenu.filters).subscribe(response => {
                this.vehicleTypes = response as VehicleType[];
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
        for (let vehicleType of this.items) {
            if (vehicleType.selected) {
                selection.push({"id": vehicleType.id, "name": vehicleType.name});
            }
        }
        this.filter.selection = selection;
    }

    private buildItems() {
        this.items = [];

        for (let vehicleType of this.vehicleTypes) {
            let vehicleTypeWrapper = new VehicleTypeWrapper(vehicleType, vehicleType.selected);
            this.items.push(vehicleTypeWrapper);
        }
    }

}

export class VehicleTypeWrapper {

	constructor(public vehicleType: VehicleType, public selected: boolean) {
	}

	public get id() {
		return this.vehicleType.id;
	}

	public get name() {
		return this.vehicleType.name;
	}

}