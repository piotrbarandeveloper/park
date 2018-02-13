import { Property, ArraySerializer } from "@co.mmons/js-utils/json";
import { Chapter } from "./chapter";

export class Analysis {

	@Property(String, "defaultTopicId")
    private _defaultTopicId: string;

	get defaultTopicId(): string {
		return this._defaultTopicId;
	}

    @Property(new ArraySerializer(Chapter), "chapters")
    private _chapters: Chapter[];

    get chapters(): Chapter[] {
        return this._chapters;
    }

}