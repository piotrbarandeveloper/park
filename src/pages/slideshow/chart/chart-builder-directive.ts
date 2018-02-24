import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chart-builder-host]',
})
export class ChartBuilderDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}