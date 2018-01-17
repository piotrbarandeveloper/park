import { Component, Input, Inject, forwardRef} from "@angular/core";
import { SegmentWrapper, SegmentationFilter } from "./segmentation-filter";


@Component({
    selector: "samar-menu-filter-segmentation-segment-item-editor",
    templateUrl: "segment-item-editor.html"
})
export class SegmentItemEditor {

    constructor(@Inject(forwardRef(() => SegmentationFilter)) private filter: SegmentationFilter) {
    }

    @Input("segments")
    public segments: SegmentWrapper[];

    public validate(segment: SegmentWrapper) {
        this.filter.validate(segment);
    }
}