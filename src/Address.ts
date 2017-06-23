/**
 * Created by projim on 20/06/2017.
 */

export class Address {
  private _city : string;
  private _cp : string;
  private _street : string;

  constructor(city : string, cp : string, street : string) {
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

  public equals(address : Address) {
    return this._city == address._city && this._cp == address._cp && this._street == address._street;
  }
}
