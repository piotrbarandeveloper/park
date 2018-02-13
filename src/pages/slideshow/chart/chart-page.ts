import { Component, Input} from '@angular/core';
import { Chart } from '../../../data/index';

@Component({
    selector: 'samar-chart',
    templateUrl: 'chart-page.html'
})
export class ChartPage  {

    constructor() {}

    @Input("content")
    charts: Chart[];

    public ngOnInit() {
        console.log("charts:", this.charts);
        
    }
}