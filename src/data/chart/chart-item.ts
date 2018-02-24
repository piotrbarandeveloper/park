import { Type } from '@angular/core';
import { Chart } from '../chart';

export class ChartItem {

    constructor(public component: Type<any>, public chart: Chart) {}

}