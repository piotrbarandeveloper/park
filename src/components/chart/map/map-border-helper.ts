export class MapBorderHelper {

    constructor(public mapData, public selectedAreas) {}

    private localMemory = {
        PREFIX_REGION_KEY: "hmb_",
        lastUpdate: "2016-12-13",
        parseStringToDateObject: function (input) { //parse a date in yyyy-m-d format
            var parts = input.split('-');
            return new Date(parts[0], parts[1]-1, parts[2]);
        },
        parseDateObjectToString: function (date) {
            return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        },
        state: typeof(localStorage ) !== "undefined" ? true : false,
        add: function (selectedAreasIds, path) {
            localStorage.setItem(this.PREFIX_REGION_KEY + selectedAreasIds.toString(), '{"date": "' + this.parseDateObjectToString(new Date()) + '","path": "' + path + '"}');
        },
        isExists: function (selectedAreasIds) {
            return (this.get(selectedAreasIds) != undefined);
        },
        get: function (selectedAreasIds) {
            return localStorage.getItem(this.PREFIX_REGION_KEY + selectedAreasIds.toString());
        }
    }

    private cleanMapData = function (data) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            newData[i] = {};
            newData[i].regionId = data[i].regionId;
            newData[i].path = data[i].path;
        }
        return newData;
    }

    private _mapData = this.cleanMapData(this.mapData);
    
    private _selectedAreas = this.selectedAreas;
    
    private checkIfShapesAreNeighborsAndGetSharedPointIndex = function (shape, otherShape) {
        var result = null;

        out:
        for (var pathId = 0; pathId < shape.paths.length; pathId++) {
            var points = shape.paths[pathId];
            
            if (points == null) continue;
            
            for (var comparedPathId = 0; comparedPathId < otherShape.paths.length; comparedPathId++) {
                var comparedPoints = otherShape.paths[comparedPathId];
                
                for (var pointId = 0; pointId < points.length; pointId++) {
                    if (this.inArray(points[pointId], comparedPoints)) {
                        result = {
                            home: {
                                firstSharedPointIndex: pointId,
                                pathId: pathId
                            },
                            compared: {
                                pathId: comparedPathId
                            }
                        };
                        break out;
                    }
                }
            }
        }
        
        return result;
    }

    private createOutsidePathForShape(pointsOfFirstShape, pointsOfSecondShape) {
        var paths = [];
        var points = [];
        var prev = {};
        for (var i = 0; i < pointsOfFirstShape.length; i++) {
            var point = pointsOfFirstShape[i];
            
            var shared = this.inArray(point, pointsOfSecondShape);
            
            if (shared) {
                if (prev['shared'] == false) {
                    points.push(point);
                    paths.push(points);
                    points = [];
                } else {
                    
                }
            } else {
                if (prev['shared'] == true) {
                    points.push(prev);
                }
                points.push(point);
            }
            
            prev = point;
            prev['shared'] = shared;
        }
        if (points.length > 0) {
            if (this.inArray(pointsOfFirstShape[0], pointsOfSecondShape) == false) {
                paths[0] = points.concat(paths[0]);
            } else {
                paths.push(points);
            }
        }
    
        return paths;
    }
    
    private ifShapesHaveSharedPoints(points, comparedPoints) {
        for (var i = 0; i < points.length; i++) {
            if (this.inArray(points[i], comparedPoints)) {
                return true;
            }
        }
        return false;
    }

    private mergeShapes(resultShape, neighborShape, connectionsDetailsForPaths) {
        var paths = [];

        for (var pathId = 0; pathId < neighborShape.paths.length; pathId++) {
            if (neighborShape.paths[pathId].length < 4) continue;
                
            //sprawdzamy czy path ma wspolne punkty z innymi pathami w 'resultShape'
            var sharedPaths = [];
            for (var pathIdOfresultShape = 0; pathIdOfresultShape < resultShape.paths.length; pathIdOfresultShape++) {
                if (resultShape.paths[pathIdOfresultShape] == null) continue;
                
                if (this.ifShapesHaveSharedPoints(neighborShape.paths[pathId], resultShape.paths[pathIdOfresultShape])) {
                    sharedPaths.push(pathIdOfresultShape);
                    //console.log("Kszalt '" + neighborShape.regionId + "' (" + neighborShape.name + ") o sciezce id:" + pathId + " ma sasiada ze sciezka w resultShape o id:", pathIdOfresultShape);
                }
            }
            
            if (sharedPaths.length == 0) { //jest to path, ktory  nie ma punktow wspolnych, ale jest czescia jakiegos regionu, w ktorym jest 'wyspa'
                resultShape.paths.push(neighborShape.paths[pathId]);
            } else if (sharedPaths.length >= 1) {
                for (var s = 0; s < sharedPaths.length; s++) {
                    if (resultShape.paths[sharedPaths[s]] == null) continue;
                
                    var p1 = this.createOutsidePathForShape(neighborShape.paths[pathId], resultShape.paths[sharedPaths[s]]);
                    var p2 = this.createOutsidePathForShape(resultShape.paths[sharedPaths[s]], neighborShape.paths[pathId]);
                    
                    if (p1.length == 0 && p2.length == 0) {
                        resultShape.paths.splice(sharedPaths[s], 1);
                        continue;
                    }
                    
                    var points;

                    for (var i = 0; i < p1.length; i++) {
                        points = [];
                        for (var j = 0; j < p2.length; j++) {
                            
                            if (p1[i][p1[i].length-1].x === p2[j][0].x  &&  p1[i][p1[i].length-1].y === p2[j][0].y) {
                                points = p1[i];
                                
                                //usuń pierwszy punkt bo dubluje się w ścieżce
                                p2[j].splice(0, 1);
                                
                                points = points.concat(p2[j]);
                                break;
                            } else if (p1[i][0].x === p2[j][0].x  &&  p1[i][0].y === p2[j][0].y) {
                                points = p1[i].reverse();
                                
                                p2[j].splice(0, 1);
                                
                                points = points.concat(p2[j]);
                                break;
                            } else {
                                points = p1[i];
                                points = points.concat(p2[j]);
                            }
                        }
                        
                        if (i == 0 ) {
                            resultShape.paths[sharedPaths[s]] = points;
                            // po kazdym przejsciu trzeba usunac ewentulane wspolne sciezki, ktore utworzyly sie w resultShape. Ksztalt neighborShape mogl miesc rowniez wspolne sciezki z innymi sciezkami resultShape
                            this.removeTheSamePathsInResultShape(resultShape, sharedPaths[s]);
                        } else {
                            resultShape.paths.push(points);
                        }
                    }
                }
            }
        }
        
        return resultShape.paths;
    }
    
    private removeTheSamePathsInResultShape(resultShape, pathId) {
        for (var i = 0; i < resultShape.paths.length; i++) {
            if (i != pathId) {
                if (resultShape.paths[i] == null) continue;
                
                if (this.ifShapesHaveSharedPoints(resultShape.paths[pathId], resultShape.paths[i])) {

                    var p1 = this.createOutsidePathForShape(resultShape.paths[pathId], resultShape.paths[i]);
                    var p2 = this.createOutsidePathForShape(resultShape.paths[i], resultShape.paths[pathId]);
                    
                    if (p1.length == 0 && p2.length == 0) {
                        resultShape.paths.splice(i, 1);
                        continue;
                    }
                
                    var points;
                        
                    for (var j = 0; j < p1.length; j++) {
                        points = [];
                        for (var k = 0; k < p2.length; k++) {
                            
                            if (p1[j][p1[j].length-1].x === p2[k][0].x  &&  p1[j][p1[j].length-1].y === p2[k][0].y) {
                                points = p1[j];
                                
                                //usuń pierwszy punkt bo dubluje się w ścieżce
                                p2[k].splice(0, 1);
                                
                                points = points.concat(p2[k]);
                                break;
                            } else if (p1[j][0].x === p2[k][0].x  &&  p1[j][0].y === p2[k][0].y) {
                                points = p1[j].reverse();
                                
                                p2[k].splice(0, 1);
                                
                                points = points.concat(p2[k]);
                                break;
                            } else {
                                points = p1[j];
                                points = points.concat(p2[k]);
                            }
                        }

                        if (j == 0 ) {
                            resultShape.paths[pathId] = points;
                            resultShape.paths[i] = null;
                        } else {
                            resultShape.paths.push(points);
                            resultShape.paths[i] = null;
                        }
                    }
                }
            }
        }
    }

    private createResultShape(shapes) {
        let resultShape = {};

        resultShape = JSON.parse(JSON.stringify(shapes[0]));
        resultShape['name'] = "New shape border";
        resultShape['region'] = "resultShape";

        shapes[0].connected = true; //oznaczamy ksztalt o identyfikatorze '0' jako scalony z nowym obszarem
        for (var j = 1; j < shapes.length; j++) { //iterujemy tyle ile jest polaczen (czyli zakladajac, ze wszystkie figury (N) lacza sie to wykonujemy N-1 obliczeń)
            for (var shapeId = 1; shapeId < shapes.length; shapeId++) {
                if (shapes[shapeId].connected != true) {
                    //console.log("##### Przetwarzamy ksztalt:", shapes[shapeId].regionId);

                    var connectionsDetailsForPaths = this.checkIfShapesAreNeighborsAndGetSharedPointIndex(resultShape, shapes[shapeId]);
                    resultShape['paths'] = this.mergeShapes(resultShape, shapes[shapeId], connectionsDetailsForPaths);
        
                    shapes[shapeId].connected = true;
                    break;
                }
            }
            
        }
        
        return resultShape;
    }

    private createPath(points) {
        var path = "M" + points[0].x + "," + points[0].y;

        for (var p = 1; p < points.length; p++) {
            path += "L" + points[p].x + "," + points[p].y;
        }

        path += "Z";

        return path;
    }

    private getRegionPointsFromShape(shape) {
        var smallShapes = [],
            points = [],
            path = [],
            result = [];
        
        smallShapes = shape.path.substring(1,shape.path.length-1).split("zM");
        
        for (var s = 0; s < smallShapes.length; s++) {
            points = [];
            path = smallShapes[s].split("L");
            for (var j = 0; j < path.length; j++) {
                var coords = path[j].split(",");
                points.push({"x": coords[0], "y": coords[1]});
            }
            result.push(points);
        }

        return result;
    }

    private sortShapesByOrderFromSelectedAreas(shapes) {
        var shapesByOrder = [];
        for (var r = 0; r < this._selectedAreas.length; r++) {
            
            for (var s = 0; s < shapes.length; s++) {
                if (parseInt(this._selectedAreas[r]) == parseInt(shapes[s].regionId)) { 
                    shapesByOrder.push(shapes[s]);
                }
            }
        }
        return shapesByOrder;
    }

    private getRegionsDealer() {
        var regionsDealer = [];

        for (var i = 0; i < this._mapData.length; i++) {
            if (this.inArray(parseInt(this._mapData[i].regionId), this._selectedAreas)) {
                
                var shape = this._mapData[i];
                if (shape.path == undefined) continue;
                shape.paths = this.getRegionPointsFromShape(shape);
                shape.path = null;
                regionsDealer.push(shape);
                
            }
        }

        return regionsDealer;
    }
    
    private getBorderFromCache() {
        var result = null;

        if (this.localMemory.state && this.localMemory.isExists(this.selectedAreas.toString())) {
            var record = JSON.parse(this.localMemory.get(this.selectedAreas.toString()));
            var recordCreatedAt = this.localMemory.parseStringToDateObject(record.date);
            var lastUpdateDate = this.localMemory.parseStringToDateObject(this.localMemory.lastUpdate);

            if (recordCreatedAt.getTime() >= lastUpdateDate.getTime()) {
                var record = JSON.parse(this.localMemory.get(this.selectedAreas.toString()));
                result = record.path;
            }
        }
        
        return result;
    }
    
    public createBorderForShape() {
        var path = this.getBorderFromCache();
        if (path == null) {
            var shapes = this.sortShapesByOrderFromSelectedAreas(this.getRegionsDealer());

            var resultShape = this.createResultShape(shapes);
            if (resultShape['paths'].length > 0) {
                var partPath = "";
                for (var s = 0; s < resultShape['paths'].length; s++) {
                    if (resultShape['paths'][s] == null || resultShape['paths'][s].length == 0) continue;
                    
                    partPath += this.createPath(resultShape['paths'][s]);
                }
                path = partPath;
            }
            if (this.localMemory.state) {
                this.localMemory.add(this.selectedAreas.toString(), path);							
            }
            
        }

        return path;
    }

    private inArray(selectedPoint, allPoints) {
        for (var i = 0; i < allPoints.length; i++) {
            if (selectedPoint.x == allPoints[i].x && selectedPoint.y == allPoints[i].y) {
                return true;
            }
        }
        return false;
    }
}