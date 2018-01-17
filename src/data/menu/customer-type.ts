import {Property, ArraySerializer} from "@co.mmons/js-utils/json";

export class CustomerType {

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

	@Property(Boolean, "selected")
	protected _selected: boolean;

	get selected(): boolean {
		return this._selected;
    }

    @Property(new ArraySerializer(CustomerType), "children")
    protected _children: Array<CustomerType>;

    get children(): Array<CustomerType> {
        return this._children;
    }
}