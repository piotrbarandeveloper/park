import { Property } from "@co.mmons/js-utils/json";
import { ChartOptions } from "./chart-options";

export class Chart {

	@Property(String, "type")
	protected _type: string;

	get type(): string {
		return this._type;
	}

	@Property(String, "heightRatio")
	protected _heightRatio: string;

	get heightRatio(): string {
		return this._heightRatio;
	}

	@Property(ChartOptions, "content")
	protected _content: any;

	get content(): any {
		return this._content;
	}

}