import {Property} from "@co.mmons/js-utils/json";

export class Address {

    @Property(String)
    name: string;

    @Property(String, "street")
    address: string;

    @Property(String, "locality")
    city: string;

    @Property(String)
    postCode: string;
}

class ContactDetails {

    @Property(String)
    email: string;

    @Property(String)
    landlinePhone: string;

    @Property(String)
    mobilePhone: string;

    @Property(Address)
    address: Address;
}

export class User {

    @Property(String, "email")
    protected _email: string;

    get email(): string {
        return this._email;
    }

    @Property(String, "firstName")
    protected _firstName: string;

    get firstName(): string {
        return this._firstName;
    }

    @Property(String, "surname")
    protected _lastName: string;

    get lastName(): string {
        return this._firstName;
    }

    get fullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }

    @Property(String, "token")
    protected _token: string;

    get token(): string {
        return this._token;
    }

    @Property(ContactDetails, "contactDetails")
    private _contactDetails: ContactDetails;

    get phone(): string {
        return this._contactDetails ? this._contactDetails.landlinePhone : undefined;
    }

    get mobilePhone(): string {
        return this._contactDetails ? this._contactDetails.mobilePhone : undefined;
    }

    concatenatePhones(): string {
        let str = "";

        let phone = this.phone;
        let mobile = this.mobilePhone;

        if (phone) {
            str = phone;
        }

        if (mobile) {
            if (phone) str += ", ";
            str += mobile;
        }

        return str;
    }

    get address(): Address {
        return this._contactDetails ? this._contactDetails.address : undefined;
    }

    get contactEmail(): string {
        return this._contactDetails && this._contactDetails.email ? this._contactDetails.email : this.email;
    }
}

export class UserAuthenticationException extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UserAuthenticationException.prototype);
        this.message = message;
    }
}