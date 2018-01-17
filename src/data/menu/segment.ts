import {Property, ArraySerializer} from "@co.mmons/js-utils/json";

export class Segment {

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

    @Property(new ArraySerializer(Segment), "children")
    protected _children: Array<Segment>;

    get children(): Array<Segment> {
        return this._children;
    }
}