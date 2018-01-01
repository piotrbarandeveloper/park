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
            value += filterItem.selection.startYear + " - " + filterItem.selection.endYear;
        } else if (filterItem.id == 'AREA') {
            value += filterItem.selection.name;
        } else if (filterItem.id == 'SEGMENTATION') {
            value += filterItem.selection.name;
        } else if (filterItem.id == 'VEHICLE_TYPE') {
            let delim = "";
            for (let type of filterItem.selection) {
                value += delim + this.capitalizeFirstLetter(type.name.replace(/Samochody/g , "").trim());
                delim = ", ";
            }
        } else if (filterItem.id == 'WEIGHT') {
            value += filterItem.selection.from + " - " + filterItem.selection.to + " [kg]";
        } else if (filterItem.id == 'MAKE') {
            value += filterItem.selection.name + (filterItem.selection.model ? " " + filterItem.selection.model.name : "");
        } else if (filterItem.id == 'FUEL' || filterItem.id == 'CUSTOMER') {
            let delim = "";
            for (let type of filterItem.selection) {
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