import {Injectable} from "@angular/core";

import {AppErrorHandler} from "./app-error-handler";

@Injectable()
export class AppManager {

	constructor(public readonly errorHandler: AppErrorHandler) {
	}
}