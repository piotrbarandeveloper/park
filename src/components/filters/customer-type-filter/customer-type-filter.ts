import { Component, Input, OnInit, ViewChild, Inject, forwardRef} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { CustomerType } from '../../../data/menu/customer-type';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-customer-type',
    templateUrl: 'customer-type-filter.html'
})
export class CustomerTypeFilter implements OnInit {

    @Input()
    private filter: FilterItem;

    /**
     * Lista typów klienta dostępnych do wyboru dla użytkownika.
     */
    private customerTypes: CustomerType[];

    public items: CustomerTypeWrapper[];

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
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
            this.dataService.menuCustomerTypeFilter(this.filtersMenu.filters).subscribe(response => {
                this.customerTypes = response as CustomerType[];
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
        let searchSelectedElement = function (customerTypes: CustomerTypeWrapper[]) {
            let elements = [];
            for (let customerType of customerTypes) {
                if (customerType.selected) {
                    elements.push({"id": customerType.id, "name": customerType.name});
                } else {
                    //jeżeli element nie jest wybrany sprawdzamy czy wśród jego dzieci są elementy zaznaczone
                    if (customerType.children) {
                        elements = elements.concat(searchSelectedElement(customerType.children));
                    }
                }
            }
            return elements;
        }
        this.filter.selection = {
            "reexport": true,
            "values": searchSelectedElement(this.items)
        };
    }

    private buildItems() {
        let createElementsWrapper = function (customerTypes: CustomerType[]) {
            let elements: CustomerTypeWrapper[] = [];
            for (let customerType of customerTypes) {
                let element = new CustomerTypeWrapper(customerType, customerType.selected, customerType.expanded);
                if (customerType.children) element.children = createElementsWrapper(customerType.children);
                elements.push(element);
            }
            return elements;
        }
        this.items = createElementsWrapper(this.customerTypes);
    }
}

export class CustomerTypeWrapper {

    public children: CustomerTypeWrapper[];

	constructor(public customerType: CustomerType, public selected: boolean, public expanded: boolean) {
	}

	public get id() {
		return this.customerType.id;
	}

	public get name() {
		return this.customerType.name;
	}

}