import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { CustomerTypeFilter } from '../../../../data/menu/customer-type-filter';

@Component({
    selector: 'samar-menu-filter-customer-type',
    templateUrl: 'customer-type-filter-menu.html'
})
export class CustomerTypeFilterMenu implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów klienta dostępnych do wyboru dla użytkownika.
     */
    public customerTypes: CustomerTypeFilter[];

    constructor(private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie listy typów klienta</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuCustomerTypeFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.customerTypes = response as CustomerTypeFilter[];
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem typów pojazdu do menu filtrów.")
            });
        })

    }

    public validate() {
        let selection: CustomerTypeFilter[] = [];
        let searchSelectedElement = function (customerTypes: CustomerTypeFilter[]) {
            let elements: CustomerTypeFilter[] = [];
            for (let customerType of customerTypes) {
                if (customerType.selected) {
                    elements.push(customerType);
                } else {
                    //jeżeli element nie jest wybrany sprawdzamy czy wśród jego dzieci są elementy zaznaczone
                    if (customerType.children) {
                        elements = elements.concat(searchSelectedElement(customerType.children));
                    }
                }
            }
            return elements;
        }
        this.filter.selection = searchSelectedElement(this.customerTypes);
    }
}