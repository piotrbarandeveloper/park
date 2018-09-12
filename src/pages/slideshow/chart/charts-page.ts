import { Component, Input, Type} from '@angular/core';
import { Chart } from '../../../data/index';
import { ChartItem } from '../../../data/chart/chart-item';
import { LinesChartComponent, MapChartComponent, BarChartComponent, UnknownChartComponent } from '../../../components/chart';

@Component({
    selector: 'samar-charts',
    templateUrl: 'charts-page.html'
})
export class ChartsPage  {

    //private _charts: Chart[];

    constructor() {}

    @Input("charts")
    set charts(charts: Chart[]) {
        this._charts = charts;
        if (this.chartItems) this.buildCharts();
    }

    private _charts: Chart[];

    public chartItems: ChartItem[];

    ngOnInit() {
		this.buildCharts();
    }

    private buildCharts() {
        this.chartItems = null;
        console.log("buildCharts");
        let chartItems = [];

        for (let chart of this._charts) {
            let type: Type<any>;
            if (chart.type == 'lines') {
                type = LinesChartComponent;
            } else if (chart.type == 'bars') {
                type = BarChartComponent;
            } else if (chart.type == 'map') {
                type = MapChartComponent;
            } else {
                type = UnknownChartComponent;
            }
            let chartItem = new ChartItem(type, chart);
            chartItems.push(chartItem);
        }

        this.chartItems = chartItems;
    }
}