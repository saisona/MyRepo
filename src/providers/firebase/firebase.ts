import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Thenable} from "firebase/app";
import {ContactComponent} from "../../components/contact/contact";

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

  public getContacts(): FirebaseListObservable<any> {
    return this.angDatabase.list('contacts', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public sync(old:any[]) : Promise<any> {
    return new Promise((resolve,reject) => {
      this.getContacts().subscribe((f_contacts : ContactComponent[]) => {
        let index_sync = 0;
        old.forEach((l_contact : ContactComponent) => {
          f_contacts.forEach((f_contact : ContactComponent) => {
            if(!l_contact.equals(f_contact)) {

            }else {
              //Nothing to do
              console.log("% is equals to % ",l_contact,f_contact);
            }
            index_sync++;
          });
          // if(index_sync)
        })
      })
    })
  }

  public deleteContact(id: object): Thenable<any> {
    return this.angDatabase.object('contacts/' + id).remove();
  }

  public updateContact(id: string, contact: object): Thenable<any> {
    return this.angDatabase.object('contacts/' + id).update(contact);
  }

}
