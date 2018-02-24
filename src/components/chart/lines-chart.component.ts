import { Component, Input } from '@angular/core';

import { ChartComponent }      from './chart.component';
import { Chart } from '../../data/index';

@Component({
  template: `
    <div>
      <h4>lines chart</h4> 
      
      {{chart | json}}
    </div>
  `
})
export class LinesChartComponent implements ChartComponent {

    @Input()
    chart: Chart;

}