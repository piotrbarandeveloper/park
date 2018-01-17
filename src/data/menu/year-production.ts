import {Property} from "@co.mmons/js-utils/json";

export class YearProduction {

	/**
	 * Minimalny rok jaki może wybrać użytkownik
	 */
	@Property(Number, "min")
	protected _min: number;

	get min(): number {
		return this._min;
	}

	/**
	 * Maksymalny rok jaki może wybrać użytkownik
	 */
	@Property(Number, "max")
	protected _max: number;

	get max(): number {
		return this._max;
	}
}
