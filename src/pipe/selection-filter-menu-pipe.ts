import { Pipe, PipeTransform } from '@angular/core';
import { FilterItem } from '../data/filter-item'; 

@Pipe({
    name: 'selectionFilterMenu',
    pure: false
})
export class SelectionFilterMenuPipe implements PipeTransform {

    constructor() {}

    transform(filterItem: FilterItem): string {
        let value = "";

        /*if (filterItem.id == 'DATE') {
            value += filterItem.selection.from.month + " " + filterItem.selection.from.year + " - " + filterItem.selection.to.month + " " + filterItem.selection.to.year;
        } else*/ if (filterItem.id == 'YEAR_PRODUCTION') {
            value += filterItem.selection.start + " - " + filterItem.selection.end;
        } else if (filterItem.id == 'DATE') {
            value += filterItem.selection.year + " - " + filterItem.selection.month;
        } else if (filterItem.id == 'AREA') {
            value += filterItem.selection.name;
        } else if (filterItem.id == 'SEGMENTATION') {
            value += filterItem.selection.name;
            if (filterItem.selection.segments && filterItem.selection.segments.length > 0) {
                value += " (";
                let delim = "";
                for (let segment of filterItem.selection.segments) {
                    value += delim + segment.name;
                    delim = ", ";
                }
                value += ")";
            }
        } else if (filterItem.id == 'VEHICLE_TYPE') {
            let delim = "";
            for (let type of filterItem.selection) {
                value += delim + this.capitalizeFirstLetter(type.name.replace(/Samochody/g , "").trim());
                delim = ", ";
            }
        } else if (filterItem.id == 'DMC') {
            value += filterItem.selection.from + " - " + filterItem.selection.to + " [kg]";
        } else if (filterItem.id == 'MAKE') {
            if (filterItem.selection && filterItem.selection.length > 0) {
                let delim = "";

                for (let make of filterItem.selection) {
                    value += delim + make.name;
                    if (make.models) {
                        let delimModel = "";
                        for (let model of make.models) {
                            value += delimModel + " " + model.name;
                            delimModel = ", ";
                        }
                    }
                    delim = ", ";
                }
            } else {
                value += "Wszystkie";
            }
        } else if (filterItem.id == 'FUEL') {
            let delim = "";
            for (let type of filterItem.selection) {
                value += delim + type.name;
                delim = ", ";
            }        
        } else if (filterItem.id == 'CUSTOMER') {
            let delim = "";
            for (let type of filterItem.selection.values) {
                value += delim + type.name;
                delim = ", ";
            }
        } else {
            value = "unknown filter";
        }
      
        return value;
    }

    capitalizeFirstLetter(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}