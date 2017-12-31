import {Property, ArraySerializer} from "@co.mmons/js-utils/json";

export class RegionFilter {

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

	@Property(Boolean, "expanded")
	protected _expanded: boolean;

	get expanded(): boolean {
		return this._expanded;
    }

    set expanded(expanded: boolean) {
        this._expanded = expanded;
    }

    @Property(new ArraySerializer(RegionFilter), "children")
    protected _children: Array<RegionFilter>;

    get children(): Array<RegionFilter> {
        return this._children;
    }
}