import { Component, Input } from '@angular/core';
// import * as HighCharts from 'highcharts';
// import Highcharts from 'highcharts/highstock';
import * as HighMaps from 'highcharts/highmaps';
import proj4 from 'proj4';

import { ChartComponent }      from '../chart.component';
import { Chart } from '../../../data/index';
import { MapColorHelper } from './map-color.helper';
import { MapBorderHelper } from './map-border-helper';
import { MapRegionShapeHelper } from './map-region-shape-helper';
import { Http } from '@angular/http';

@Component({
  template: `
    <div>
      <h4>map chart</h4> 
      <ion-spinner *ngIf="spinnerVisible" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)"></ion-spinner>
      <div [hidden]="spinnerVisible" id="container" style="display: block; height: 100%;width: 100%;"></div>
    </div>
  `,
})

export class MapChartComponent implements ChartComponent {

    public spinnerVisible: boolean = true;

    private static LIMIT_MAXIMUM_NUMBER_OF_LABLES = 30;

    private zoom: number = 1;

    constructor(private http: Http) {
    }

    @Input()
    chart: Chart;

    ngOnInit() {
        console.log("chart:", this.chart);
        let helper = new MapRegionShapeHelper(this.chart.content.mapData, this.http);
		if (helper.isLackOfPaths()) {
			let promise = helper.run();
			promise.subscribe((response) => {
                console.log("response:", response);
                console.log("response.json:", response.json());
                console.log("response.text:", response.text());
				helper.joinData(response.json());
				this.drawMap(helper.regions);
			});
		} else {
			this.drawMap(helper.regions);
        }
    }

    private drawMap(regions) {
        regions.sort(function(a,b) {return b.numberOfPoints - a.numberOfPoints});
        this.initData(regions);

        console.log("this.getData():", this.getData());
        let myChart = HighMaps.mapChart('container', this.getData());
        this.spinnerVisible = false;
    }

    private initData(regions) {
        console.log("regions:", regions);
        this.initChartOptions();
        this.initDataLabelsOptions();
        this.initColorAxis();
        this.initLegendOptions();
        this.initTooltipOptions();
        this.initMapNavigationOptions();
        this.initSeries(regions);
    }

    private getData() {
        return {
            chart: this._chartOptions,
            mapNavigation: this._mapNavigationOptions,
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            plotOptions: {
                // map: dataHelper.getMap().getPlotOptions(),
                series: {
                    borderWidth: 1,
                    borderColor: "#efefef",
                    dataLabels: this._dataLabelsOptions
                }
            },
            tooltip: this._tooltipOptions,
            colorAxis: this._colorAxis,
            legend: this._legendOptions,
            series: this._series,//dataHelper.getMap().generateSeries(mapData, data.pointsData, selectedAreas, data.pointsBubble),
            credits: {
                enabled: false
            }
        };
    }

    private _chartOptions: any;

    private initChartOptions() {
        this._chartOptions =  {
            borderWidth: 0,
            backgroundColor: "transparent"
        };
    }

    private _colorAxis;

    private initColorAxis() {
        let colorsHelper = new MapColorHelper(this.chart.content.mode, this.chart.content.legendOptions, false/*todo*/);
		colorsHelper.initColors(this.chart.content.colors);
		colorsHelper.initAxis();
		colorsHelper.computeMaxValue(this.chart.content.mapData);
		if (this.chart.content.mode == MapColorHelper.DIFFERENCE) {
			colorsHelper.computeMinValue(this.chart.content.mapData);
			colorsHelper.limitMaxAndMinAxis();
        }
        this._colorAxis = colorsHelper.getColorAxis();
    }

    private _legendOptions;

    private initLegendOptions() {
        let legendOptions = {};
   
        legendOptions['title'] = {
            text: this.chart.content.legendTitle + ":"
        };
        legendOptions['align'] = 'left';
        legendOptions['backgroundColor'] = 'rgba(255, 255, 255, 0.0)';
        legendOptions['layout'] = this.chart.content.legendOptions != undefined && this.chart.content.legendOptions.layout != undefined ? this.chart.content.legendOptions.layout : 'horizontal';
        legendOptions['verticalAlign'] = 'bottom';
        legendOptions['x'] = 0;
        legendOptions['y'] = this.chart.content.legendOptions != undefined && this.chart.content.legendOptions.y != undefined ? this.chart.content.legendOptions.y : 3;
        legendOptions['margin'] = 0;
        legendOptions['padding'] = 0;
        legendOptions['floating'] = true;

        this._legendOptions = legendOptions;
    }

    private _dataLabelsOptions: any;

    private initDataLabelsOptions() {
        let dataLabelsOptions = {};

        console.log("this.chart.content:", this.chart.content);
        console.log("this.chart.content.mapData:", this.chart.content.mapData);
        if (this.chart.content.mapData.length < MapChartComponent.LIMIT_MAXIMUM_NUMBER_OF_LABLES) {
            dataLabelsOptions['enabled'] = true;
        } else {
            dataLabelsOptions['enabled'] = false;
        }
        dataLabelsOptions['allowOverlap'] = true;

        let label = this.chart.content.label;
        let that = this;
        dataLabelsOptions['formatter'] = function () {
            if (this.point.type.indexOf("selected-area") > -1 && label.selectedArea) {
                return that.createTextBoxOnMap(this.point, label.selectedArea);
            } else if (this.point.type.indexOf("point") > -1 && label.point) {
                return that.createTextBoxOnMap(this.point, label.point);
            } else if (this.point.type.indexOf("shape") > -1 && label.shape) {
                return that.createTextBoxOnMap(this.point, label.shape);
            } else {
                return "";
            }
        };
        
        dataLabelsOptions['padding'] = 3;
        dataLabelsOptions['color'] = "#ffffff";
        dataLabelsOptions['style'] = {
            textOutline: false
        };
        // let userAgent = window.navigator.userAgent;
        // if (userAgent.indexOf("MSIE") > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
        //     dataLabelsOptions.style = {
        //         textShadow: false
        //     };
        //     dataLabelsOptions.shadow = false;
        // } else {
        //     dataLabelsOptions.shadow = true;
        //     dataLabelsOptions.style['text-shadow'] = "0px 0px 2px rgb(61, 61, 61)";
        // }
                    
        this._dataLabelsOptions = dataLabelsOptions;
    }

    private _tooltipOptions: any;

    private initTooltipOptions() {
        let tooltipOptions = {};
        let mode = this.chart.content.mode;
        
        if (mode === MapColorHelper.REGISTRATIONS) {
            tooltipOptions['formatter'] = function () {
                let result = "";

                result += "<strong>" + this.x + "</strong><br />";
                result += "Rejestracje: " + HighMaps.numberFormat(this.y, 0, ',', ' ');

                return result;
            };
        } else if (mode === MapColorHelper.CHANGE_REGISTRATIONS) {
            tooltipOptions['formatter'] = function () {
                let result = "";

                result += "<strong>" + this.x + "</strong><br />";
                result += "Zmiana: " + this.point.labelValue.toFixed(1) + ' %';

                return result;
            };
        } else if (mode === MapColorHelper.PENETRATION) {
            tooltipOptions['pointFormat'] = '<b>{point.labelValue}%</b>';
        }
    
        this._tooltipOptions = tooltipOptions;
    }

    private _series: any;

    private initSeries(mapData) {
        let selectedAreas = [];
        if (this.chart.content.selectedAreas != undefined) {
            for (let areaId = 0; areaId < this.chart.content.selectedAreas.length; areaId++) {
                let borderCreator = new MapBorderHelper(mapData, this.chart.content.selectedAreas[areaId].regions);
                let area = {};
                area = this.chart.content.selectedAreas[areaId];
                area['color'] = "transparent";
                area['path'] = borderCreator.createBorderForShape();
                area['type'] = "selected-area-" + areaId;
                selectedAreas.push(area);
            }
        }
        let pointsData = this.chart.content.pointsData;
        let pointsBubble = this.chart.content.pointsBubble;
        let series = [];
        
        for (let shapeId = 0; shapeId < mapData.length; shapeId++) {
            let shape = mapData[shapeId];
            shape.type = "shape-"+shape.regionId;
        }
        
        series.push({
            typ: "map",
            data: mapData,
            borderWidth: 1,
            borderColor: "#dddddd",
            states: {
                hover: {
                    borderColor: "gray",
                    borderWidth: 3
                },
                select: {
                    color: {
                        pattern: './img/pattern.jpg',
                        width: 6,
                        height: 6,
                        color1: 'red',
                        color2: 'yellow'
                    },
                    borderColor: "#efefef",
                    borderWidth: 4
                }
            }
        });
        
        if (selectedAreas && selectedAreas.length > 0) {
            series.push({
                typ: "map",
                data: selectedAreas,
                dataLabels: {
                    enabled: true
                },
                states: {
                    hover: {
                        color: "transparent",
                        borderColor: "gray",
                        borderWidth: 3
                    }
                }
            });
        }
        
        if (pointsData && pointsData.length > 0) {
            let projection = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=WGS84 +units=m +no_defs";
            let mapVisiblePoints = [];
            //TODO
            // if (savedSettings.state && savedSettings.isExists("mapPoints")) {
            //     mapVisiblePoints = JSON.parse(savedSettings.get("mapPoints"));
            // }
            
            for (let makeId = 0; makeId < pointsData.length; makeId++) {
                
                let makePointsData = pointsData[makeId];
                
                let dealers = [];
                for (let pointId = 0; pointId < makePointsData.points.length; pointId++) {
                    let pointOfDealer = {};
                    
                    pointOfDealer = makePointsData.points[pointId];
                    
                    let values = proj4(projection, [pointOfDealer['coordinates'][1], pointOfDealer['coordinates'][0]]);
                    let yg = 774923;
                    pointOfDealer['x'] = values[0];
                    pointOfDealer['y'] = (yg - values[1]);
                    pointOfDealer['z'] = 10;
                    pointOfDealer['type'] = "points-" + pointOfDealer['id'];
                    
                    dealers.push(pointOfDealer);
                    
                }
                
                let visible = false;
                for (let vp = 0; vp < mapVisiblePoints.length; vp++) {
                    if (mapVisiblePoints[vp] == makePointsData.name) {
                        visible = true;
                        break;
                    }
                }
                
                if (dealers.length > 0) {
                    series.push({
                        "type": "mappoint",
                        "name": makePointsData.name,
                        "color": makePointsData.color,
                        "data": dealers,
                        "marker": {
                            "fillColor": makePointsData.color,
                            "lineColor": "white",
                            "lineWidth": 1,
                            "radius": 4,
                            "symbol": "circle"
                        },
                        "visible": visible,
                        //"cursor": data.pointRedirect != undefined && data.pointRedirect == true? "pointer" : "default",
                        "point": {
                            // "events": {
                            //     "click": function () {
                            //         if (this.redirect == true || (this.redirect != undefined && this.redirect.analysis != undefined)) {
                            //             let selectionId = "";
                            //             for (let i = 0; i < menuService.menu.length; i++) {
                            //                 if (menuService.menu[i].id == 'analysis') {
                            //                     selectionId = menuService.menu[i].selection.id
                            //                 }
                            //                 if (menuService.menu[i].id == 'area') {
                            //                     menuService.menu[i].selection.id = this.regionId;
                            //                 }
                            //             }
                            //             if (this.redirect.analysis != undefined) {
                            //                 selectionId = this.redirect.analysis;
                            //             }
                                        
                            //             menuService.updateSelection("analysis", {"id": selectionId}).then(function() {
                            //                 analysisService.loadAnalysis(menuService.getRequest()).then(null, function(error) {
                            //                     if (error.error.type != "ValidationError") {
                            //                         throw error;
                            //                     }
                            //                     menuService.showErrors(error.error["fields"]);
                            //                 });
                            //             });
                                        
                            //         }
                            //     }
                            // }
                        }
                    });
                }
            }
        }

        if (pointsBubble && pointsBubble.data.length > 0) {
            let bubbleMapData = [];
            bubbleMapData = [];
            for (let shapeId = 0; shapeId < mapData.length; shapeId++) {
                let shape = {};
                shape['regionId'] = mapData[shapeId].regionId;
                shape['path'] = mapData[shapeId].path;
                shape['type'] = "bubble-" + mapData[shapeId].regionId;
                bubbleMapData.push(shape);
            }
            
            series.push({
                type: "mapbubble",
                name: pointsBubble.legend,
                mapData: bubbleMapData,
                data: pointsBubble.data,
                color: pointsBubble.color,
                maxSize: "10%",
                minSize: 1,
                joinBy: ['regionId', 'regionId']
            });
        }
        
        console.log("this._series:", series);

        this._series = series;
    }

    private createTextBoxOnMap(point, content) {
        let result = "";
        for (let i = 0; i < content.length; i++) {
            let line = "";
                
            if (typeof content[i] === 'object') {
                let cond = content[i];
                let value = point[cond.value];
                let lineCondition = "";
                for (let j = 0; j < cond.ranges.length; j++) {
                    let fromValue = -Number.MAX_VALUE;
                    let toValue = Number.MAX_VALUE;
                    if (cond.ranges[j].from != undefined) {
                        fromValue = cond.ranges[j].from;
                    }
                    if (cond.ranges[j].to != undefined) {
                        toValue = cond.ranges[j].to;
                    }
                    if (value >= fromValue && value < toValue) {
                        line = cond.ranges[j].text;
                        break;
                    }
                }
            } else {
                line = content[i];
            }
            let dictionaryletiables = line.match(/{{[a-zA-Z0-9]+}}/g);
            let dataletiables = line.match(/\$\$[a-zA-Z0-9\|]+\$\$/g);

            if (dictionaryletiables) {
                for (let d = 0; d < dictionaryletiables.length; d++) {
                    line = line.replace(dictionaryletiables[d], dictionaryletiables[d].substring(2, dictionaryletiables[d].length-2));
                }
            }

            if (dataletiables) {
                for (let d = 0; d < dataletiables.length; d++) {
                    let value = dataletiables[d].substring(2, dataletiables[d].length-2);
                    let types = value.match(/\|[a-zA-Z0-9]+/g);
                    if (types) {
                        let value2 = value.substring(0, value.indexOf("|"));
                        for (let t = 0; t < types.length; t++) {
                            let type = types[t].substring(1);
                            if (type == "number") {
                                line = line.replace(dataletiables[d], HighMaps.numberFormat(point[value2], 0, ',', ' '));
                            } else if (type == "double") {
                                if (typeof point[value2] == 'string') {
                                    line = line.replace(dataletiables[d], point[value2]);
                                } else {
                                    line = line.replace(dataletiables[d], point[value2].toFixed(1));
                                }
                            }
                        }
                    } else {
                        line = line.replace(dataletiables[d], point[value]);
                    }
                }
            }
            result += line + "<br />";
        }
        
        return result;
    }

    private _mapNavigationOptions;

    private initMapNavigationOptions() {
        var mapNavigationOptions = {};
        
        let that = this;
        mapNavigationOptions['enabled'] = true;
        mapNavigationOptions['buttons'] = {
            zoomIn: {
                onclick: function () {
                    if (that.chart.content.mapData.length >= MapChartComponent.LIMIT_MAXIMUM_NUMBER_OF_LABLES && that.zoom == 1) {
                        if (this.series.length == 1) {
                            this.series[0].update({
                                dataLabels: {
                                    enabled: true
                                }
                            });
                        } else if (this.series.length == 2) {
                            this.series[0].update({
                                dataLabels: {
                                    enabled: true
                                }
                            }, false);
                            this.series[1].update({
                                dataLabels: {
                                    enabled: true
                                }
                            });
                        }
                    }
                    that.zoom -= 0.1;
                    this.mapZoom(0.5);
                }
            },
            zoomOut: {
                onclick: function () {
                    that.zoom += 0.1;
                    if (that.chart.content.mapData.length >= MapChartComponent.LIMIT_MAXIMUM_NUMBER_OF_LABLES && that.zoom == 1) {
                        if (this.series.length == 1) {
                            this.series[0].update({
                                dataLabels: {
                                    enabled: false
                                }
                            });
                        } else if (this.series.length > 1) {
                            this.series[0].update({
                                dataLabels: {
                                    enabled: false
                                }
                            }, false);
                            this.series[1].update({
                                dataLabels: {
                                    enabled: true
                                }
                            });
                        }
                    }
                    this.mapZoom(2);
                }
            }
        };
        mapNavigationOptions['enableDoubleClickZoom'] = false;
        mapNavigationOptions['enableDoubleClickZoomTo'] = false,
        mapNavigationOptions['enableMouseWheelZoom'] = false;
        
        this._mapNavigationOptions = mapNavigationOptions;
    }
}