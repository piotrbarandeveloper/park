import {Property} from "@co.mmons/js-utils/json";

export class Analysis {

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

	@Property(String, "description")
	protected _description: string;

	get description(): string {
		return this._description;
	}

	@Property(Boolean, "active")
	protected _active: boolean;

	get active(): boolean {
		return this._active;
	}

	@Property(Boolean, "selected")
	protected _selected: boolean;

	get selected(): boolean {
		return this._selected;
	}

	@Property(String, "icon")
	protected _icon: string;

	get icon(): string {
		return this._icon;
	}

	@Property(Boolean, "titles")
	protected _titles: boolean;

	get titles(): boolean {
		return this._titles;
	}

	@Property(Number, "timestamp")
    protected _timestamp: number;

	get timestamp(): number {
		return this._timestamp;
	}

	@Property(String, "default_slide")
	protected _defaultSlide: string;

	get defaultSlide(): string {
		return this._defaultSlide;
	}

    //chapters: Array<Chapter>;
}