export class MapColorHelper {

    public static REGISTRATIONS = "registrations";

    public static CHANGE_REGISTRATIONS = "changeRegistrations";

    public static PENETRATION = "penetration";

    public static DIFFERENCE = "difference";

    constructor(public type, public legendOptions, public logarithmicLegend) {}

    private selectedColors = null;
	
	private maxValue = null;
	
	private minValue = null;
	
	private colors = {
		palettes: [
			{min: "#cc0000", part1: "#FFA500", part2: "#ffffff", part3: "#00B159", max: "#004623"},
			{min: "#E6E7E8", average: "#005645", max: "#005645"},
			{min: "#B20000", average: "#FFFFFF", max: "#136f2c"},
			{min: "#B20000", average: "#FFFFFF", max: "#136f2c"}
		],
		axis: {
			min: 0,
			reversed: true
		}
	};

	public getColorAxis = function () {
		return this.colors.axis;
	}
	
	public initColors = function (data) {
		if (data != undefined) {
			this.selectedColors = data;
		} else {
			this.selectedColors = this.colors.palettes[this.type];
		}
	}
	
	public initAxis() {

		if (this.type == MapColorHelper.PENETRATION) {
			this.colors.axis['max'] = 200;
			
			this.colors.axis['stops'] = [
				[0, this.selectedColors.min],
				[0.35, this.selectedColors.part1],
				[0.50, this.selectedColors.part2],
				[0.65, this.selectedColors.part3],
				[1, this.selectedColors.max]
			];
		} else if (this.type == MapColorHelper.CHANGE_REGISTRATIONS) {
			this.colors.axis['max'] = 100;
			this.colors.axis['min'] = -100;
			this.colors.axis['stops'] = [
				[0, this.selectedColors.min],
				[0.5, this.selectedColors.average],
				[1, this.selectedColors.max]
			];
		} else if (this.type == MapColorHelper.DIFFERENCE) {
			this.colors.axis['stops'] = [
				[0, this.selectedColors.min],
				[0.5, this.selectedColors.average],
				[1, this.selectedColors.max]
			];
		} else if (this.type == MapColorHelper.REGISTRATIONS) {
			if (this.logarithmicLegend) {
				this.colors.axis['type'] = 'logarithmic';
				this.colors.axis['min'] = 1;
				this.colors.axis['stops'] = [
					[0, this.selectedColors.min],
					[1, this.selectedColors.max]
				];
			} else {
				this.colors.axis['stops'] = [
					[0, this.selectedColors.min],
					[0.5, this.selectedColors.average],
					[1, this.selectedColors.max]
				];
			}
		}
		if (this.legendOptions != undefined) {
			if (this.legendOptions.dataClasses != undefined ) {
				this.colors.axis['dataClasses'] = this.legendOptions.dataClasses;
			}
		}
	}
	
	public computeMaxValue(mapData) {
		for (let i = 0; i < mapData.length; i++) {
			if (this.maxValue < mapData[i].value) {
				this.maxValue = mapData[i].value;
			}
		} 
	}
	
	public computeMinValue(mapData) {
		for (let i = 0; i < mapData.length; i++) {
			if (this.minValue > mapData[i].value) {
				this.minValue = mapData[i].value;
			}
		} 
	}

	private getSelectedColors() {
		return this.selectedColors;
	}
	
	private createStops(value) {
		var stops = [];
		stops.push([0, this.createColor(0)]);

		if (value <= 100) {
			stops.push([1, this.createColor(value)]);
		} else if (value > 100) {
			stops.push([100/value, this.createColor(100)]);
			stops.push([1, this.createColor(value)]);
		}
		return stops;
	}
	
	private perShapeGradient = {
		x1: 1,
		y1: 1,
		x2: 1,
		y2: 0
	}
	
	private color2rgb(color) {
		var r = parseInt(color.substr(1, 2), 16);
		var g = parseInt(color.substr(3, 2), 16);
		var b = parseInt(color.substr(5, 2), 16);
		
		return new Array(r, g, b);
	}

	private rgb2color(rgb) {
		var s = "#";
		for (var i = 0; i <3; i++)
		{
			var c = Math.round(rgb[i]).toString(16);
			if (c.length == 1)
			c = '0' + c;
			s += c;
		}

		return s.toUpperCase();
	}
	
	public limitMaxAndMinAxis() {
		if (this.maxValue < -this.minValue) {
			this.colors.axis['max'] = -this.minValue;
			this.colors.axis['min'] = this.minValue;
		} else {
			this.colors.axis['max'] = this.maxValue;
			this.colors.axis['min'] = -this.maxValue;
		}
	}

	private createColor(value) {
		var step,
			startColor,
			endColor,
			Gradient = new Array(3);
		
		value = Math.round(value);
	
		if (this.type == MapColorHelper.PENETRATION) {
			step = 100;
			
			if (value < 75) {
				startColor = this.color2rgb(this.selectedColors.min);
				endColor = this.color2rgb(this.selectedColors.part1);
			} else if (value >= 75 && value < 100) {
				startColor = this.color2rgb(this.selectedColors.part1);
				endColor = this.color2rgb(this.selectedColors.part2);
			} else if (value >= 100 && value < 125) {
				startColor = this.color2rgb(this.selectedColors.part2);
				endColor = this.color2rgb(this.selectedColors.part3);
			} else {
				startColor = this.color2rgb(this.selectedColors.part3);
				endColor = this.color2rgb(this.selectedColors.max);
			}

			for (var i = 0; i <= step; i++) {
				for (var j = 0; j <3; j++) {
					Gradient[j] = startColor[j] + (endColor[j]-startColor[j]) / step * i;
				}
				if ((value <= 100 && value == i) || (value > 100 && value == (i+100))) {
					break;
				}
			}
		} else if (this.type == MapColorHelper.CHANGE_REGISTRATIONS) {
			if (value > 100) {
				value = 100;
			} else if (value < -100) {
				value = -100;
			}
			step = 100;
			startColor = this.color2rgb(this.selectedColors.min);
			endColor = this.color2rgb(this.selectedColors.average);
			
			if (value > 0) {
				startColor = this.color2rgb(this.selectedColors.average);
				endColor = this.color2rgb(this.selectedColors.max);
			}
			
			for (var i = 0; i <= step; i++) {
				for (var j = 0; j <3; j++) {
					Gradient[j] = startColor[j] + (endColor[j]-startColor[j]) / step * i;
				}
				if ((value <= 0 && value == (i-100)) || (value > 0 && value == i)) {
					break;
				}
			}
		} else if (this.type == MapColorHelper.REGISTRATIONS) {
			step = 100;
			var valueNorm = Math.round(value/this.maxValue * 100);

			if (valueNorm < 50) {
				startColor = this.color2rgb(this.selectedColors.min);
				endColor = this.color2rgb(this.selectedColors.average);
			} else {
				startColor = this.color2rgb(this.selectedColors.average);
				endColor = this.color2rgb(this.selectedColors.max);
			}
			
			for (var i = 0; i <= step; i++) {
				for (var j = 0; j <3; j++) {
					Gradient[j] = startColor[j] + (endColor[j]-startColor[j]) / step * i;
				}
				if (valueNorm == i) {
					break;
				}
			}
		}

		return this.rgb2color(Gradient);
	}
}