/**
 * Created by projim on 20/06/2017.
 */

export class Address {
  private _city;
  private _cp;
  private _street;


  constructor(city, cp, street) {
    this._city = city;
    this._cp = cp;
    this._street = street;
  }


  get city() {
    return this._city;
  }

  set city(value) {
    this._city = value;
  }

  get cp() {
    return this._cp;
  }

  set cp(value) {
    this._cp = value;
  }

  get street() {
    return this._street;
  }

  set street(value) {
    this._street = value;
  }
}
