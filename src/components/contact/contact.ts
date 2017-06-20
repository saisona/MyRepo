import {Component} from '@angular/core';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Address} from '../../Address';
import {Thenable} from "firebase/app";

/**
 * Generated class for the ContactComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {

  private _name: string;
  private _fname: string;
  private _address: Address;
  private _notes: string;


  constructor(name: string, fname: string, address: Address, notes: string, public _fp: FirebaseProvider) {
    this._name = name;
    this._fname = fname;
    this._address = address;
    this._notes = notes;
  }


  set name(value: string) {
    this._name = value;
  }

  set fname(value: string) {
    this._fname = value;
  }

  set address(value: Address) {
    this._address = value;
  }

  set notes(value: string) {
    this._notes = value;
  }


  public set fp(value: FirebaseProvider) {
    this._fp = value;
  }

  get name(): string {
    return this._name;
  }

  get fname(): string {
    return this._fname;
  }

  get address(): Address {
    return this._address;
  }

  /**
   * Function used to save the Contact onto the FirebaseDatabse
   * @returns {Thenable<any>} return a Promise that will tell if fails or not !
   */
  public save(): Thenable<any> {
    let contact_to_save: object = {};
    contact_to_save['name'] = this._name;
    contact_to_save['fname'] = this._fname;
    contact_to_save['address'] = this._address;
    contact_to_save['notes'] = this._notes;
    console.log(`contact_to_save => `, contact_to_save);
    return this._fp.addContact(contact_to_save)
  }

  /**
   * Function used to update an existing contact
   * @param {ContactComponent} c the Contact to update
   * @returns {Thenable<any>}
   */
  public update(c : any) : Thenable<any> {
    let contact_to_update: object = {};
    contact_to_update['name'] = c._name;
    contact_to_update['fname'] = c._fname;
    contact_to_update['address'] = c._address;
    contact_to_update['notes'] = c._notes;
    console.log(`contact_to_save => `, contact_to_update);
    return c._fp.updateContact(c.$key,contact_to_update);
  }

  get notes(): string {
    return this._notes;
  }

  static get_default(): ContactComponent {
    return new ContactComponent('', '', new Address('', '', ''), '', null);
  }
}
