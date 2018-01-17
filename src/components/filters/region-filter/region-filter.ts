import { Component, Input, OnInit, ViewChild, Inject, forwardRef} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { Region } from '../../../data/menu/region';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-region',
    templateUrl: 'region-filter.html'
})
export class RegionFilter implements OnInit {

    @Input()
    public filter: FilterItem;

    /**
     * Lista regionów dostępnych do wyboru dla użytkownika.
     */
    private regions: Region[];

    public items: RegionWrapper[];

    @ViewChild(Scroll)
    private scroll: Scroll;

    constructor(@Inject(forwardRef(() => FiltersMenu)) public filtersMenu: FiltersMenu, private loadingController: LoadingController, private dataService: DataService, private errorHandler: AppErrorHandler) {
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
            this.dataService.menuRegionFilter(this.filtersMenu.filters).subscribe(response => {
                this.regions = response as Region[];
                this.buildItems();
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

    private buildItems() {
        this.items = [];

        for (let region of this.regions) {

            let regionWrapper = new RegionWrapper(region, region.expanded);
            if (region.children) {
                let childrenWrapper = [];
                for (let child of region.children) {
                    childrenWrapper.push(new RegionWrapper(child));
                }
                regionWrapper.children = childrenWrapper;
            } 
            
            this.items.push(regionWrapper);
        }
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
    public clickedRegion(regionWrapper: RegionWrapper) {
        if (regionWrapper.group) {
            this.toggleRegions(regionWrapper);
        } else {
            this.selectRegion(regionWrapper.region);
        }
    }

    private toggleRegions(regionWrapper: RegionWrapper) {
        regionWrapper.expanded = !regionWrapper.expanded;
    }

    private selectRegion(region: Region) {
        this.filter.selection = region;
    }

}

export class RegionWrapper {

    public children: RegionWrapper[];

	constructor(public region: Region, public expanded?: boolean) {
	}

	public get id() {
		return this.region.id;
	}

	public get name() {
		return this.region.name;
	}

	public get group() {
		return this.region.group;
	}

}