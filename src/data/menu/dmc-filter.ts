import {Property} from "@co.mmons/js-utils/json";

export class DMCFilter {

	@Property(Number, "min")
	protected _min: number;

	get min(): number {
		return this._min;
	}

	@Property(Number, "max")
	protected _max: number;

	get max(): number {
		return this._max;
	}
}
