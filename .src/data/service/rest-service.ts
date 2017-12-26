import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { _throw } from "rxjs/Observable/throw";
import { map } from "rxjs/operators/map";

import sha512 from "crypto-js/sha512";

import { User, UserAuthenticationException } from "../user";

import { unserialize } from "@co.mmons/js-utils/json";
import { FilterItem } from "../filter-item";
import { Analysis } from "../analysis";

var BASE_URL = "http://194.181.16.233/api/";
var BASE_URL_TEMP_TO_JSON = "./assets/json/";

var USER: User;
var USER_EMAIL: string;
var USER_TOKEN: string;

const USER_EMAIL_KEY = "user.email";
const USER_TOKEN_KEY = "user.token";

@Injectable()
export class RestService {

	constructor(public http: Http) {
	}

	public isSignedIn(): boolean {

		if (USER_EMAIL && USER_TOKEN) {
			return true;
		}

		USER_EMAIL = window.localStorage.getItem(USER_EMAIL_KEY);
		USER_TOKEN = window.localStorage.getItem(USER_TOKEN_KEY);

		if (USER_EMAIL && USER_TOKEN) {
			return true;
		}

		return false;
	}

	public signIn(email?: string, password?: string): Observable<User> {

		let token: string;

		if (!email && this.isSignedIn()) {
			email = USER_EMAIL;
			token = USER_TOKEN;
		}

		if ((!email && !password) || (!password && (!email || !token))) {
			console.log("Wymagane logowanie");
			return _throw(new UserAuthenticationException("Wymagane logowanie"));
		}

		return this.http.get(`${BASE_URL}login?privileges=true&contactDetails=true&email=${email}${password ? "&password=" : ""}${password ? sha512(password) : ""}${token ? "&token=" : ""}${token ? token : ""}`).pipe(map(response => {

			var json = response.json();

			if (json.status == "SUCCESS" && json.result) {
				let user = <User>unserialize(json.result, User);

				window.localStorage.setItem(USER_EMAIL_KEY, user.email);
				window.localStorage.setItem(USER_TOKEN_KEY, user.token);

				USER = user;
				USER_EMAIL = user.email;
				USER_TOKEN = user.token;

				return user;

			} else if (json.message) {
				throw new UserAuthenticationException(json.message);
			}

		}, error => {
			console.log(error);
		}));
    }

	public signOut(): Promise<any> {

		return new Promise(async (resolve, reject) => {
			USER_EMAIL = undefined;
			USER_TOKEN = undefined;
			USER = undefined;
			window.localStorage.removeItem(USER_EMAIL_KEY);
			window.localStorage.removeItem(USER_TOKEN_KEY);

			try {
				await this.http.get(`${BASE_URL}logout?email=${USER_EMAIL}&token=${USER_TOKEN}`).toPromise();
			} catch (e) {
			}

			resolve();
		});
	}

	public filters(): Observable<FilterItem[]> {
		return this.http.get(BASE_URL_TEMP_TO_JSON + "menu/menu.json").pipe(map(response => this.mapResponse<FilterItem>(response, FilterItem)));
	}

	public listAnalysis(): Observable<Analysis[]> {
		return this.http.get(BASE_URL_TEMP_TO_JSON + "list-analysis.json").pipe(map(response => this.mapResponse<Analysis>(response, Analysis)));
	}

	private mapResponse<T>(response: Response, resultClass: any): Array<T> {

		var json = response.json();

		if (json.results instanceof Array) {
			var results = new Array<T>();

			for (let i = 0; i < json.results.length; i++) {
				let o = unserialize(json.results[i], resultClass) as T;
				results.push(o);
			}

			return results;
		}
	}
}