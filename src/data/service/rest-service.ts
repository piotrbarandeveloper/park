import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { _throw } from "rxjs/Observable/throw";
import { map } from "rxjs/operators/map";

import sha512 from "crypto-js/sha512";

import { User, UserAuthenticationException } from "../user";

import { unserialize } from "@co.mmons/js-utils/json";
import { FilterItem } from "../filter-item";
import { Analysis } from "../analysis";
import { YearProduction } from "../menu/year-production";
import { Region } from "../menu/region";
import { VehicleType } from "../menu/vehicle-type";
import { FuelType } from "../menu/fuel-type";
import { CustomerType } from "../menu/customer-type";
import { DMC as DMCFilter} from "../menu/dmc";
import { Make } from "../menu/make";
import { Segment } from "../menu/segment";

var LOGIN_API_URL = "http://194.181.16.233/api/";
var REPORTS_API_URL = "http://localhost:8080/reports/api/";
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

		return this.http.get(`${LOGIN_API_URL}login?privileges=true&contactDetails=true&email=${email}${password ? "&password=" : ""}${password ? sha512(password) : ""}${token ? "&token=" : ""}${token ? token : ""}`).pipe(map(response => {

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
				await this.http.get(`${LOGIN_API_URL}logout?email=${USER_EMAIL}&token=${USER_TOKEN}`).toPromise();
			} catch (e) {
			}

			resolve();
		});
	}

	/**
	 * Pobranie filtrów dla wybranej analizy. Przy braku stanu menu ładowane są domyślne parametry.
	 */
	public filters(/*stan menu o ile jest z wybrana analiza*/): Observable<FilterItem[]> {
		return this.http.get(BASE_URL_TEMP_TO_JSON + "menu/menu.json").pipe(map(response => this.mapResponse<FilterItem>(response, FilterItem)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie roku produkcyjnego m.in. zakresu lat dostępnych do wyboru przez użytkownika.
	 */
	public menuYearProductionFilter(filters: FilterItem[]): Observable<YearProduction[]> {
		return this.http.post(REPORTS_API_URL + "menu/year-production/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<YearProduction>(response, YearProduction)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru obszaru analizu m.in. listę dostępnych regionów do wyboru przez użytkownika.
	 */
	public menuRegionFilter(filters: FilterItem[]): Observable<Region[]> {
		return this.http.post(REPORTS_API_URL + "menu/area/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<Region>(response, Region)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru typów pojazdu m.in. listę dostępnych typów pojazdu do wyboru przez użytkownika.
	 */
	public menuVehicleTypeFilter(filters: FilterItem[]): Observable<VehicleType[]> {
		return this.http.post(REPORTS_API_URL + "menu/vehicle-type/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<VehicleType>(response, VehicleType)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru typów paliwa m.in. listę dostępnych typów paliw do wyboru przez użytkownika.
	 */
	public menuFuelTypeFilter(filters: FilterItem[]): Observable<FuelType[]> {
		return this.http.post(REPORTS_API_URL + "menu/fuel/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<FuelType>(response, FuelType)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru typów klienta m.in. listę dostępnych typów klienta do wyboru przez użytkownika.
	 */
	public menuCustomerTypeFilter(filters: FilterItem[]): Observable<CustomerType[]> {
		return this.http.post(REPORTS_API_URL + "menu/customer/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<CustomerType>(response, CustomerType)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru dmc m.in. zakresu lat dostępnych do wyboru przez użytkownika.
	 */
	public menuDMCFilter(filters: FilterItem[]): Observable<DMCFilter[]> {
		return this.http.post(REPORTS_API_URL + "menu/dmc/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<DMCFilter>(response, DMCFilter)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru marek m.in. listy marek oraz modeli.
	 */
	public menuMakeFilter(filters: FilterItem[]): Observable<Make[]> {
		return this.http.post(REPORTS_API_URL + "menu/make/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<Make>(response, Make)));
	}

	/**
	 * Pobranie danych potrzebnych do wyświetlenie filtru segmentacji m.in. listy segmentacji oraz segmentów.
	 */
	public menuSegmentationFilter(filters: FilterItem[]): Observable<Segment[]> {
		return this.http.post(REPORTS_API_URL + "menu/segmentation/pl", JSON.stringify(filters), {headers: new Headers({"Content-Type": "application/json"})}).pipe(map(response => this.mapResponse<Segment>(response, Segment)));
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