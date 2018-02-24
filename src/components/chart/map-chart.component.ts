import { Component, Input } from '@angular/core';

import { ChartComponent }      from './chart.component';
import { Chart } from '../../data/index';

@Component({
  template: `
    <div>
      <h4>map chart</h4> 
      
      {{chart | json}}
    </div>
  `
})
export class MapChartComponent implements ChartComponent {

    @Input()
    chart: Chart;

}