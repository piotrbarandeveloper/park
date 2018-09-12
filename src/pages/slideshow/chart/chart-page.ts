import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { ChartBuilderDirective } from './chart-builder-directive';
import { ChartItem } from '../../../data/chart/chart-item';
import { ChartComponent } from '../../../components/chart/chart.component';

@Component({
    selector: 'samar-chart',
    template: '<ng-template chart-builder-host></ng-template>'
})
export class ChartPage {

    @Input()
    chartItem: ChartItem;

    @ViewChild(ChartBuilderDirective)
    adHost: ChartBuilderDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.chartItem.component);

        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<ChartComponent>componentRef.instance).chart = this.chartItem.chart;
        // (<ChartComponent>componentRef.instance).spinnerVisible = true;
    }

}