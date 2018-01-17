import { Component, Input, OnInit, ViewChild, forwardRef, Inject} from '@angular/core';
import { LoadingController, Searchbar } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { Make } from '../../../data/menu/make';
import { Model } from '../../../data/menu/model';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-make',
    templateUrl: 'make-filter.html'
})
export class MakeFilter implements OnInit {

    @Input()
    private filter: FilterItem;

	@ViewChild(Searchbar)
    private searchbar: Searchbar;
    
    /**
     * Lista marek i modeli dostępnych do wyboru dla użytkownika.
     */
    private makes: Make[];
    
    /**
     * Lista marek i modeli opakowana dodatkowymi metodami potrzebnymi do obsługi filtrów.
     */
    public makesAndModels: MakeWrapper[];

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie listy marek</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuMakeFilter(this.filtersMenu.filters).subscribe(response => {
                this.makes = response as Make[];
                this.buildMakesAndModels();
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem marek do menu filtrów.")
            });
        })

    }

    public validate(makeWrapper: MakeWrapper, modelWrapper?: ModelWrapper) {
        console.log("makeWrapper", makeWrapper);
        console.log("modelWrapper", modelWrapper);
        console.log("validate (1):", !modelWrapper && makeWrapper && !makeWrapper.selected);
        //jeżeli odznaczyliśmy markę resetujemy wszystkie modele
        if (!modelWrapper && makeWrapper && !makeWrapper.selected) {
            for (let model of makeWrapper.models) {
                model.selected = false;
            }
        }
        //gdy został wybrany model zaznaczamy markę
        if (modelWrapper) {
            makeWrapper.selected = true;
        }

        //budowania tablicy selection dla marek/modeli
        let selection = [];
        for (let make of this.makesAndModels) {
            if (make.selected) {
                let item = {"id": make.id, "name":make.name, "models": []};
                for (let model of make.models) {
                    if (model.selected) {
                        item.models.push({"id": model.id, "name": model.name});
                    }
                }
                selection.push(item);
            }
        }

        this.filter.selection = selection;
    }

    private searchQuery: string;

	public search() {
		this.searchQuery = <string>this.searchbar.value;
		this.buildMakesAndModels();
    }
    
    private buildMakesAndModels() {
        let searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : undefined;
        let showAll: boolean = !searchQuery || searchQuery == "";

        this.makesAndModels = [];

        for (let make of this.makes) {

            let modelsWrapper = [];
            if (make.models) {
                for (let model of make.models) {
                    if (!showAll && model.name.toLowerCase().indexOf(searchQuery) < 0) {
                        continue;
                    }
                    let modelWrapper = new ModelWrapper(model, model.selected);
                    modelsWrapper.push(modelWrapper);
                }
            }
            if (!showAll && modelsWrapper.length == 0 && make.name.toLowerCase().indexOf(searchQuery) < 0) {
                continue;
            }
            let makeWrapper = new MakeWrapper(make, make.selected, modelsWrapper);
            this.makesAndModels.push(makeWrapper);
        }
    }
}

export class MakeWrapper {

    public expanded: boolean;

	constructor(public make: Make, public selected: boolean, public models: ModelWrapper[]) {
	}

	public get id() {
		return this.make.id;
	}

	public get name() {
		return this.make.name;
	}

}

export class ModelWrapper {

	constructor(public model: Model, public selected: boolean) {}

	public get id() {
		return this.model.id;
    }

	public get name() {
		return this.model.name;
	}
}