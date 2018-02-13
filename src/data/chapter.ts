import { Property, ArraySerializer } from "@co.mmons/js-utils/json";
import { Topic } from "./topic";

export class Chapter {

	@Property(String, "id")
    private _id: string;

	get id(): string {
		return this._id;
	}

	@Property(String, "title")
	private _title: string;

	get title(): string {
		return this._title;
    }

	@Property(Boolean, "selected")
	private _selected: boolean;

	get selected(): boolean {
		return this._selected;
	}

    @Property(new ArraySerializer(Topic), "topics")
    private _topics: Topic[];

    get topics(): Topic[] {
        return this._topics;
    }
}