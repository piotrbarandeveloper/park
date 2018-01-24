import { Component, Input, OnInit, ViewChild, forwardRef, Inject} from '@angular/core';
import { LoadingController, Scroll } from 'ionic-angular';
import { AppErrorHandler } from '../../../app/app-error-handler';

import { Observable } from "rxjs/Observable";

import { RestService as DataService} from '../../../data/service/rest-service';

import { FilterItem } from '../../../data/filter-item';
import { Segment } from '../../../data/menu/segment';
import { FiltersMenu } from '../../../pages/main/menu/filters-menu';

@Component({
    selector: 'samar-filter-segmentation',
    templateUrl: 'segmentation-filter.html'
})
export class SegmentationFilter implements OnInit {

    @Input()
    public filter: FilterItem;

    /**
     * Lista segmentacji
     */
    private segmentations: Segment[];

    public items: SegmentWrapper[];

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
                <div class="custom-spinner-box">Pobieranie segmentacji</div>
            </div>`
        });

        loading.present().then(() => {
            this.dataService.menuSegmentationFilter(this.filtersMenu.filters).subscribe(response => {
                this.segmentations = response as Segment[];
                this.buildItems();
                loading.dismiss();
            }, error => {
                loading.dismiss();
                this.errorHandler.handle(error, "Problem z pobraniem regionów do menu.")
            });
        })

    }

    private buildItems() {
        this.items = [];

        let parseSegments = function(children: Segment[], parentId: number) {
            let segmentsWrapper = [];
            for (let child of children) {
                let segmentWrapper = new SegmentWrapper(child, parentId, child.selected);
                if (child.children) segmentWrapper.segments = parseSegments(child.children, parentId);
                segmentsWrapper.push(segmentWrapper);
            }
            return segmentsWrapper;
        }

        for (let segmentation of this.segmentations) {

            let segmentationWrapper = new SegmentWrapper(segmentation, segmentation.id, segmentation.selected);
            if (segmentation.children) {
                segmentationWrapper.segments = parseSegments(segmentation.children, segmentation.id);
            } 
            
            this.items.push(segmentationWrapper);
        }
    }

    public validate(segment: SegmentWrapper) {
        console.log("validate:", segment);
        console.log("PRZY ZMIANIE SEGMETNACJI NALEZY WYSLAC ZAPYTANIE O ZMIANE STANU MENU (KONIECZNOSC ZMIANY TYPOW POJAZDU!)");
        //segment.selected = !segment.selected;
        
        //czyścimy wszystkie pozostałe segmentacje (o ile wybrany element nie nalezy do wybranej segmentacji)
        for (let segmentation of this.items) {
            if (segmentation.id != segment.segmentationId) {
                this.clearSegments(segmentation);
            }
        }
        
        //aktualizujemy 'selection' dla wybranego filtra
        for (let segmentation of this.items) {
            if (segment.segmentationId == segmentation.id) {
                let segments = [];
                if (segmentation.segments) {
                    segments = this.getSelectedSegments(segmentation.segments);
                }
                this.filter.selection = {
                    "id": segmentation.id,
                    "name": segmentation.name,
                    "segments": segments
                };
                break;
            }
        }
        
    }

    public toggle(segment: SegmentWrapper) {
        segment.expanded = !segment.expanded;
    }

    /**
     * Czyści podany obiekt segmentacji
     */
    private clearSegments(segment: SegmentWrapper) {
        segment.selected = false;
        if (segment.segments) {
            for (let child of segment.segments) {
                this.clearSegments(child);
            }
        }
    }

    private getSelectedSegments(segments: SegmentWrapper[]) {
        let elements = [];
        for (let segment of segments) {
            if (segment.selected) {
                elements.push({"id": segment.id, "name": segment.name});
            }
            if (segment.segments) {
                elements = elements.concat(this.getSelectedSegments(segment.segments));
            }
        }
        return elements;
    }

}

export class SegmentWrapper {

    public segments: SegmentWrapper[];

    public expanded: boolean;

	constructor(public segment: Segment, public segmentationId: number, public selected: boolean) {
	}

	public get id() {
		return this.segment.id;
	}

	public get name() {
		return this.segment.name;
	}

}