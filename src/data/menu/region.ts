import {Property, ArraySerializer} from "@co.mmons/js-utils/json";

export class Region {

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

	@Property(Boolean, "group")
	protected _group: boolean;

	get group(): boolean {
		return this._group;
    }

	@Property(Boolean, "expanded")
	protected _expanded: boolean;

	get expanded(): boolean {
		return this._expanded;
    }

    @Property(new ArraySerializer(Region), "children")
    protected _children: Array<Region>;

    get children(): Array<Region> {
        return this._children;
    }
}