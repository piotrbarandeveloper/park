import {Property, ArraySerializer} from "@co.mmons/js-utils/json";

export class CustomerTypeFilter {

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

	@Property(Boolean, "selected")
	protected _selected: boolean;

	get selected(): boolean {
		return this._selected;
    }

    set selected(selected: boolean) {
        this._selected = selected;
    }

    @Property(new ArraySerializer(CustomerTypeFilter), "children")
    protected _children: Array<CustomerTypeFilter>;

    get children(): Array<CustomerTypeFilter> {
        return this._children;
    }
}