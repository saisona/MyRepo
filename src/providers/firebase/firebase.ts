import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Thenable} from "firebase/app";

/*
 Generated class for the FirebaseProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class FirebaseProvider {


  constructor(public angDatabase: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  public addContact(c: object): Thenable<any> {
    return this.angDatabase.list('contacts').push(c);
  }

  public getContacts() : FirebaseListObservable<any> {
    return this.angDatabase.list('contacts');
  }

  public deleteContact(id : object) : Thenable<any> {
    return this.angDatabase.object('contacts/'+id).remove();
  }

  public updateContact(id : string, contact : object) : Thenable<any> {
    return this.angDatabase.object('contacts/'+id).update(contact);
  }

}
