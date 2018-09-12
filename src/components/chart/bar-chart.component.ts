import { Component, Input } from '@angular/core';

import * as HighCharts from 'highcharts';

import { ChartComponent }      from './chart.component';
import { Chart } from '../../data/index';

@Component({
  template: `
    <div>
      <h4>bar chart</h4>
    
      {{chart | json}}
    </div>
  `
})
export class BarChartComponent implements ChartComponent {

    public spinnerVisible: boolean = true;

    @Input()
    chart: Chart;

    ngOnInit() {
        console.log("BarChartComponent:", this.chart);
        let myChart = HighCharts.chart('container', this.chart.content);
    }
}