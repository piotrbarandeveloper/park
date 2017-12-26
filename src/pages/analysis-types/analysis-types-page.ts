import { Component } from '@angular/core';
import { RestService } from '../../data/service/rest-service';
import { AppManager } from '../../app/app-manager';
import { Analysis } from '../../data/analysis';

@Component({
  selector: 'samar-analysis-types-page',
  templateUrl: 'analysis-types-page.html'
})
export class AnalysisTypesPage {
  
    protected spinnerVisible: boolean;

    public items: Analysis[];

    public selectedAnalysis: Analysis;
    
    constructor(private restService: RestService, private appManager: AppManager) {
        this.spinnerVisible = true;
    }

    public ngOnInit() {
        this.loadAnalysis();
    }

    public selectAnalysis($event, item: Analysis) {
        console.log("selectAnalysis:", item);
        this.selectedAnalysis = item;
        
        //panel dolny z przyciskami dezaktywowac przy pomocy argumentu $event
        //pobranie nowego menu
        //otwarcie menu filtrów
    }

    private loadAnalysis() {
        this.restService.listAnalysis().subscribe(items => {
            this.items = items;
            for (let item of items) {
                if (item.selected) {
                    this.selectedAnalysis = item;
                    break;
                }
            }
            console.log("this.selectedAnalysis:", this.selectedAnalysis);
            this.spinnerVisible = false;
		}, error => this.appManager.errorHandler.show(error));
    }

}
