import { Component } from '@angular/core';
import { RestService as DataService} from '../../data/service/rest-service';
import { LoadingController } from 'ionic-angular';
import { AppManager } from '../../app/app-manager';
import { AnalysisType } from '../../data/menu/analysis-type';
import { FilterType } from '../../data/filter-type';

@Component({
  selector: 'samar-analysis-types-page',
  templateUrl: 'analysis-types-page.html'
})
export class AnalysisTypesPage {
  
    protected spinnerVisible: boolean;

    public items: AnalysisType[];

    public selectedAnalysis: AnalysisType;
    
    constructor(private dataService: DataService, private loadingController: LoadingController, private appManager: AppManager) {
        this.spinnerVisible = true;
    }

    public ngOnInit() {
        this.loadAnalysisTypes();
    }

    public selectAnalysis($event, item: AnalysisType) {
        this.selectedAnalysis = item;
        
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie filtrów dla wybranej analizy</div>
            </div>`
        });
        
        loading.present().then(() => {
            this.dataService.filters(this.dataService.filtersCache, {id: FilterType.ANALYSIS, selection: {id: this.selectedAnalysis.id, name: this.selectedAnalysis.name}}).subscribe(() => {
                this.spinnerVisible = false;
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.appManager.errorHandler.show(error);
            });
        });
    }

    private loadAnalysisTypes() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie listy analiz</div>
            </div>`
        });
        
        loading.present().then(() => {
            this.dataService.listAnalysis(this.dataService.rememberedFilters()).subscribe(items => {
                this.items = items;
                for (let item of items) {
                    if (item.selected) {
                        this.selectedAnalysis = item;
                        break;
                    }
                }

                if (this.dataService.isRememberedFilters()) {
                    this.dataService.filtersCache = this.dataService.rememberedFilters();
                    this.spinnerVisible = false;
                    loading.dismiss();
                } else {
                    loading.setContent(`<div class="custom-spinner-container">
                        <div class="custom-spinner-box">Pobieranie filtrów dla wybranej analizy</div>
                    </div>`);

                    this.dataService.filters(this.dataService.rememberedFilters()).subscribe(() => {
                        this.spinnerVisible = false;
                        loading.dismiss();
                    });
                }
                //if (!this.dataService.filtersCache()) {
                    
                //} else {
                //    this.spinnerVisible = false;
                //    loading.dismiss();
                //}
            }, error => {
                loading.dismiss();
                this.appManager.errorHandler.show(error);
            });
        });
    }

}
