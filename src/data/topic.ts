import { Property, ArraySerializer } from "@co.mmons/js-utils/json";
import { Chart } from "./chart";

export class Topic {

	@Property(String, "id")
    protected _id: string;

	get id(): string {
		return this._id;
	}

	@Property(String, "title")
	protected _title: string;

	get title(): string {
		return this._title;
	}

	@Property(String, "iconName")
	protected _iconName: string;

	get iconName(): string {
		return this._iconName;
	}

    @Property(new ArraySerializer(Chart), "content")
    protected _charts: Array<Chart>;

    get charts(): Array<Chart> {
        return this._charts;
    }
}