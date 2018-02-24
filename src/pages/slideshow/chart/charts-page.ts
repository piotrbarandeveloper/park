import { Component, Input, Type} from '@angular/core';
import { Chart } from '../../../data/index';
import { ChartItem } from '../../../data/chart/chart-item';
import { LinesChartComponent, MapChartComponent, BarChartComponent, UnknownChartComponent } from '../../../components/chart';

@Component({
    selector: 'samar-charts',
    templateUrl: 'charts-page.html'
})
export class ChartsPage  {

    constructor() {}

    @Input("content")
    charts: Chart[];

    chartItems: ChartItem[];

    public ngOnInit() {
        let chartItems = [];
        let data = [];

        for (let i = 0; i <= 5; i += 1) {
            data.push({
                x: i,
                y: Math.floor(Math.random() * 10) + 0
            });
        }

        for (let chart of this.charts) {
            let type: Type<any>; 
            if (chart.type == 'graphLines') {
                type = LinesChartComponent;
            } else if (chart.type == 'graphBars') {
                type = BarChartComponent;
            } else if (chart.type == 'graphMap') {
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