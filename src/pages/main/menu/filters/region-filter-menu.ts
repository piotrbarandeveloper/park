import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";
import { forkJoin } from "rxjs/observable/forkJoin";

import { RestService as DataService} from '../../../../data/service/rest-service';

import { FilterItem } from '../../../../data/filter-item';
import { RegionFilter } from '../../../../data/menu/region-filter';

@Component({
    selector: 'samar-menu-filter-region',
    templateUrl: 'region-filter-menu.html'
})
export class RegionFilterMenu implements OnInit {

    @Input()
    public filter: FilterItem;

    /**
     * Lista regionów dostępnych dla użytkownika.
     */
    public regions: RegionFilter[];

    @ViewChild(Scroll)
    private scroll: Scroll;

    constructor(private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        let loading = this.loadingController.create({
            content: `<div class="custom-spinner-container">
                <div class="custom-spinner-box">Pobieranie obszarów</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuRegionFilter(/*przekazac stan menu this.dataService.menu()*/).subscribe(response => {
                this.regions = response as RegionFilter[];
                setTimeout( () => {
                    this.scrollTo(this.scroll._scrollContent.nativeElement, document.getElementById("region-"+this.filter.selection.id).offsetTop, 1000, 20);
                }, 500);
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem regionów do menu.")
            });
        })

    }

    /**
     * Scroll to elementu z efektem typu easeinout
     */
    private scrollTo(element, to, duration, increment) {
        let start = element.scrollTop;
        let change = to - start;
        
        let easeInOut = function easeInOut(currentTime, start, change, duration) {
            currentTime /= duration / 2;
            if (currentTime < 1) {
                return change / 2 * currentTime * currentTime + start;
            }
            currentTime -= 1;
            return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
        };

        let animateScroll = function(elapsedTime) {        
            elapsedTime += increment;
            var position = easeInOut(elapsedTime, start, change, duration);                        
            element.scrollTop = position; 
            if (elapsedTime < duration) {
                setTimeout(function() {
                    animateScroll(elapsedTime);
                }, increment);
            }
        };
    
        animateScroll(0);
    }

    /**
     * Metoda uruchamiana przy wyborze elementu z listy regionów. Może to być zarówno grupa regionów jak i konkretny region
     */
    public clickedRegion(region: RegionFilter) {
        if (region.id != -1) {
            this.selectRegion(region);
        } else {
            this.toggleListRegions(region);
        }
    }

    /**
     * Rozwija grupę elementów
     */
    private toggleListRegions(region: RegionFilter) {
        region.expanded = !region.expanded;
    }

    /**
     * Zaznaczamy wybrany element
     */
    private selectRegion(region: RegionFilter) {
        this.filter.selection.id = region.id;
        this.filter.selection.name = region.name;
    }

}