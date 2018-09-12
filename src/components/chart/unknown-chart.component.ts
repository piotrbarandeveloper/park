import { Component, Input } from '@angular/core';

import * as HighCharts from 'highcharts';

import { ChartComponent }      from './chart.component';
import { Chart } from '../../data/index';

@Component({
  template: `
    <div>
      <h1 style="text-align: left; font-size: small;">title chart - unknown type</h1>
      <div id="container" style="display: block; height: 100%;width: 100%;"></div>
    </div>
  `
})
export class UnknownChartComponent implements ChartComponent {

    public spinnerVisible: boolean = true;

    @Input()
    chart: Chart;

    ngOnInit() {
        console.log("UnknownChartComponent:", this.chart);
        let myChart = HighCharts.chart('container', this.getData());
    }

    private getData() {
        return {
            chart: {
                type: 'spline'
            },
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: (function() {
                    var data = [];
                    for (let i = 0; i <= 5; i += 1) {
                        data.push({
                            x: i,
                            y: Math.floor(Math.random() * 10) + 0
                        });
                    }
                    return data;
                }())
            }, {
                name: 'John',
                data: (function() {
                    var data = [];
                    for (let i = 0; i <= 5; i += 1) {
                        data.push({
                            x: i,
                            y: Math.floor(Math.random() * 10) + 0
                        });
                    }
                    return data;
                }())
            }]
        };
    }
}