import { Property, ArraySerializer } from "@co.mmons/js-utils/json";
import { Model } from "./model";

export class Make {

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

    @Property(new ArraySerializer(Model), "models")
    protected _models: Array<Model>;

    get models(): Array<Model> {
        return this._models;
    }
}