import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/operator/toPromise';
import { Storage } from "@ionic/storage";
import { ContactComponent } from "../../components/contact/contact";

/*
 Generated class for the LocalStorageProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class LocalStorageProvider {

  private contacts: any[];
  private COUNTER_ID: number;

  constructor(protected storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
  }

  isStorageExists(): Promise<boolean> {
    return this.storage.get('contacts').then(values => values !== null);
  }

  public addValue(contact): Promise<boolean> {
    contact.id = this.COUNTER_ID++;
    this.contacts.push(contact);
    console.log("ENTER ADD CONTACT");
    return this.storage.set('contacts', this.contacts).then(isSuccess => {
      console.log(`isSuccess `, isSuccess);
      this.storage.set('count_id', this.COUNTER_ID);
    }).then(res => {
      return true
    });
  }

  public getContacts(): Promise<any> {
    return this.storage.get('contacts').then((res: ContactComponent[]) => {
      console.log("IN PROVIDER => ", res);
      return res;
    });
  }

  public deleteValue(contact): Promise<boolean> {
    this.contacts.slice(this.contacts.indexOf(contact), 1);
    return this.storage.set('contacts', this.contacts).then(isSuccess => console.log(`isSuccess `, isSuccess)).then(res => {
      return true
    });
  }
}
