import {Http, Headers, Response} from "@angular/http";
import { Observable } from "rxjs/Observable";

export class MapRegionShapeHelper {

    constructor(public data, private http: Http) {
    }

    public localMemory = {
		PREFIX_REGION_KEY: "highmapsregion_",
		lastUpdate: "2018-04-2s0",
		parseStringToDateObject: function (input) { //parse a date in yyyy-m-d format
			let parts = input.split('-');
			return new Date(parts[0], parts[1]-1, parts[2]);
		},
		parseDateObjectToString: function (date) {
			return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
		},
		state: typeof(localStorage ) !== "undefined" ? true : false,
		add: function (regionId, record) {
			localStorage.setItem(this.PREFIX_REGION_KEY + regionId, '{"date": "' + this.parseDateObjectToString(new Date()) + '","path": "' + record.path + '","numberOfPoints": ' + record.numberOfPoints + '}');
		},
		isExists: function (regionId) {
			return (this.get(regionId) != undefined);
		},
		get: function (regionId) {
			return localStorage.getItem(this.PREFIX_REGION_KEY + regionId);
		}
    };
    
    public mergeData(i, regionId) {
        let record = JSON.parse(this.localMemory.get(regionId));
        this.data[i].path = record.path;
        this.data[i].numberOfPoints = record.numberOfPoints;
	}
    
    public getAllWithUnknownPaths() {
        let regionsIds = [];
        let regionId;
        let highmapsRegion;
        let highmapsRegionDate;

        for (let i = 0; i < this.data.length; i++) {
            if (this.localMemory.state) {
                regionId = this.data[i].regionId;
                if (regionId == 0) continue;

                if (this.localMemory.isExists(regionId)) {
                    highmapsRegion = JSON.parse(this.localMemory.get(regionId));
                    highmapsRegionDate = this.localMemory.parseStringToDateObject(highmapsRegion.date);
                    let lastUpdateDate = this.localMemory.parseStringToDateObject(this.localMemory.lastUpdate);
                    
                    if (highmapsRegionDate.getTime() < lastUpdateDate.getTime()) {
                        regionsIds.push(this.data[i].regionId);
                    } else {
                        this.mergeData(i, regionId);
                    }
                } else {
                    regionsIds.push(regionId);
                }
            } else {
                regionsIds.push(this.data[i].regionId);
            }
        }
        return regionsIds;
    }

    public joinData(regionsPathsFromServer) {
        let newData = [];
		let regionId,
			highmapsRegionId;

		for (let i = 0; i < regionsPathsFromServer.length; i++) {
			regionId = regionsPathsFromServer[i].regionId;
			
			for (let ic = 0; ic < this.regions.length; ic++) {
				if (regionId == this.regions[ic].regionId) {
					newData[i] = this.regions[ic];
					newData[i].path = regionsPathsFromServer[i].path;
					newData[i].numberOfPoints = regionsPathsFromServer[i].numberOfPoints;
					
					if (this.localMemory.state) {
						this.localMemory.add(regionId, regionsPathsFromServer[i]);							
					}
					break;
				}
			}
		}
		this.regions = newData;
    };

	public isLackOfPaths() {
		return this.getAllWithUnknownPaths().length > 0 ? true : false;
	};
	
	set regions(data) {
		this.data = data;
	};
	
	get regions() {
		return this.data;
	};
	
	public run(): Observable<Response> {
        return this.http.post("http://localhost:8080/services.misc.RegionShapeServlet?highmaps", JSON.stringify(this.getAllWithUnknownPaths()), {headers: new Headers({"Content-Type": "application/json"})} );
		// let promise = $.ajax({
		// 	type: "POST",
		// 	url: "/services.misc.RegionShapeServlet?highmaps",
		// 	contentType:"application/json; charset=utf-8",
		// 	data: JSON.stringify(this.regions.getAllWithUnknownPaths()),
		// 	dataType: 'json',
		// 	beforeSend: function(  ) {
		// 		$("body").find(".loader").attr("style", "display: block");
		// 	}
		// });
		// promise.always(function() {
		// 	$("body").find(".loader").attr("style", "");
		// });
		// return promise;
	}; 
}