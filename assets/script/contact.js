'use strict';

export default class Contact {
    constructor(name, city, email) {
        this._name = name;
        this._city = city;
        this._email = email;
    }

    get name() {
        return this._name;
    }

    get city() {
        return this._city;
    }

    get email() {
        return this._email;
    }
}
