import {Property} from "@co.mmons/js-utils/json";

export class FuelTypeFilter {

	@Property(Number, "id")
	protected _id: number;

	get id(): number {
		return this._id;
    }

	@Property(String, "name")
	protected _name: string;

	get name(): string {
		return this._name;
    }

	@Property(Boolean, "selected")
	protected _selected: boolean;

	get selected(): boolean {
		return this._selected;
    }

    set selected(selected: boolean) {
        this._selected = selected;
    }
}