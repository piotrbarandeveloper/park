import {Property} from "@co.mmons/js-utils/json";

export class FilterItem {

	@Property(String, "id")
	protected _id: string;

	get id(): string {
		return this._id;
	}

	@Property(String, "name")
	protected _name: string;

	get name(): string {
		return this._name;
	}

	@Property(Object, "selection")
	protected _selection: any;

	get selection(): any {
		return this._selection;
	}

	set selection(selection: any) {
		this._selection = selection;
	}

	@Property(String, "class")
	protected _className: string;

	get className(): string {
		return this._className;
	}
}
