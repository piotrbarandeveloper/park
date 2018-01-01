import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { VehicleTypeFilter } from '../../../../data/menu/vehicle-type-filter';

@Component({
    selector: 'samar-menu-filter-vehicle-type',
    templateUrl: 'vehicle-type-filter-menu.html'
})
export class VehicleTypeFilterMenu implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów pojazdów dostępnych do wyboru dla użytkownika.
     */
    public vehicleTypes: VehicleTypeFilter[];

    constructor(private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
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
            this.dataService.menuVehicleTypeFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.vehicleTypes = response as VehicleTypeFilter[];
                for (let vehicleType of this.vehicleTypes) {
                    if (this.filter.selection.some(item => item.id == vehicleType.id)) {
                        vehicleType.selected = true;
                    }
                }
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem typów pojazdu do menu filtrów.")
            });
        })

    }

    public validate() {
        let selection: VehicleTypeFilter[] = [];
        for (let vehicleType of this.vehicleTypes) {
            if (vehicleType.selected) {
                selection.push(vehicleType);
            }
        }
        this.filter.selection = selection;
    }

}