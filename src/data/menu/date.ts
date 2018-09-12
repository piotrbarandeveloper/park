import {Property} from "@co.mmons/js-utils/json";

export class Date {

	@Property(Number, "fromYear")
	protected _fromYear: number;

	get fromYear(): number {
		return this._fromYear;
	}

	@Property(Number, "fromMonth")
	protected _fromMonth: number;

	get fromMonth(): number {
		return this._fromMonth;
	}

	@Property(Number, "toYear")
	protected _toYear: number;

	get toYear(): number {
		return this._toYear;
	}

	@Property(Number, "toMonth")
	protected _toMonth: number;

	get toMonth(): number {
		return this._toMonth;
	}
}
