import {Component} from '@angular/core';
import { ModalController, Platform, ToastController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {ContactComponent} from '../../components/contact/contact';
import {AddContactPage} from "../add-contact/add-contact";
import {DetailsContactPage} from '../details-contact/details-contact';
import {FormControl} from "@angular/forms";
import {Storage} from '@ionic/storage';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/map';

declare const navigator: any;
declare const Connection: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected contacts: any[];
  private initializedContacts: ContactComponent[];
  protected _searchValue: string = "";
  protected gettingData: boolean;
  protected isSync: boolean;

  private _searchControl: FormControl;

  constructor(public firebase: FirebaseProvider, public modalCtrl: ModalController, public toastCtrl: ToastController, private platform: Platform, protected storageIonic: Storage) {
    this.storageIonic.ready().then(storage => {
      storage.getItem('contacts').then((vls : any[]) => {
        console.log("ENTER constructor =>",vls);
        if(vls !== null && vls !== undefined )
          this.contacts = vls.sort(this.sort_function);
        else
          this.contacts = [];
      });
    });
    this._searchControl = new FormControl();
    this.gettingData = false;
    this.isSync = false;
  }


  ionViewDidLoad() {
    this._searchControl.valueChanges.debounceTime(700).subscribe(() => {
      this.setFilteredItems();
    });
  }

  public
  setFilteredItems() {
    this.contacts = (this.filterItems(this._searchValue));
  }

  private
  filterItems(searchTerm) {
    if (searchTerm == "")
      return this.initializedContacts;
    else
      return this.initializedContacts.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.fname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }


  selectItem(c: ContactComponent): void {
    let modal = this.modalCtrl.create(DetailsContactPage, {contact: c});
    modal.present();
  }


  deleteItem(c: ContactComponent) {
    console.log(c);
    // this.checkNetwork().then(connected => {
    //   if(connected) {
    //     this.firebase.deleteContact(c.$key).then(() => {
    //       let toast = this.toastCtrl.create({
    //         message: contact.name + " " + contact.fname + " a été supprimé !",
    //         duration: 1500,
    //         showCloseButton: true,
    //         closeButtonText: 'Ok'
    //       });
    //       toast.present();
    //     })    
    //   }
    //   else {
        this.storageIonic.ready().then(storage => {
          storage.getItem('contacts').then((contacts : any[]) => {
            let index_to_delete = -1;
            console.log("ENTER FINDING TO DELETE !", contacts);
            for(let index=0; index < contacts.length; index++) {
                console.log(c,contacts[index]);
                if(this.equals(contacts[index],c)) {
                  console.log("ENTER FOUND !");
                  index_to_delete = index;
                  break;
                }
            }
            if(index_to_delete !== -1)
              contacts.splice(index_to_delete,1);
            else
              console.log("CANNOT FIND THE CONTACT TO DELETE")

            storage.setItem('contacts', contacts);
            this.contacts = contacts;
            this.initializedContacts = contacts;
          })
        });
      // }
    // })
    
  }


  addItem(): void {
    let modal = this.modalCtrl.create(AddContactPage, {add: true});

    modal.onDidDismiss((contact: ContactComponent) => {
      if (contact !== null) {
        // contact.fp = this.firebase;
        // contact.save().then(() => {
        //   let toast = this.toastCtrl.create({
        //     message: "Le contact a été ajouté",
        //     duration: 1500,
        //     showCloseButton: true,
        //     closeButtonText: 'Ok'
        //   });
        //   toast.present();
        //   this.initializedContacts.push(contact);
        // }).catch(err => {
        //   console.log(err);
        //   alert("There was an ERROR !");
        // });
        this.storageIonic.ready().then(storage => {
          storage.getItem('contacts').then((contacts : ContactComponent[]) => {
            if(contacts === null) {
              contacts = [];
            }
            contacts.push(contact);
            contacts.sort(this.sort_function);

            storage.setItem('contacts', contacts);
            this.contacts = contacts;
            this.initializedContacts = contacts;
          })
        });
      }
      else
        console.log("You have cancelled the action ! OR CLOSED ");
    });
    modal.present();
  }


  updateItem(c: any) {
    let c_update = {
      contact: {
        name: c.name,
        fname: c.fname,
        address: {city: c._address._city, cp: c._address._cp, street: c._address._street},
        $key: c.$key || null,
        notes: c.notes
      },
      add: false
    };
    console.log(c_update);
    let modal = this.modalCtrl.create(AddContactPage, c_update);
    modal.onDidDismiss((contact: ContactComponent) => {
        if (contact != null) {
          console.log("You tried to update !");
          ContactComponent.update(contact, this.firebase).then(() => {
            let toast = this.toastCtrl.create({
              message: "Le contact a été modifié",
              duration: 1500,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            toast.present();
          }).catch(err => {
            console.log(err);
            alert("There was an ERROR !");
          });
        }
      }
    );
    modal.present();
  }


  sync() {
    this.isSync = true;
    this.checkNetwork().then(isConnected => {
      let toast;
      if (isConnected) {
        this.firebase.sync(this.initializedContacts).then(() => {
          toast = this.toastCtrl.create({
            message: "Synchronisation is conplete !",
            duration: 1500,
          });
          toast.present();
          this.isSync = false;
        });
      } else {
        toast = this.toastCtrl.create({
          message: "Vous devez être connecté pour synchroniser !",
          duration: 1500,
        });
        this.isSync = false;
        toast.present();
      }

    });
  }

  /**
   * Function only available on Smartphone (unavailable on browser) that returns if the device is connected or not !
   * @returns {Promise<string>} return isConnected (!CELL OR NONE)
   */
  protected
  checkNetwork(): Promise<string> {
    return new Promise((resolve) => {
      this.platform.ready().then(() => {
        const networkState = navigator.connection.type;
        let states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        resolve(networkState !== Connection.NONE && networkState !== Connection.CELL);
      });
    });
  }

  private sort_function(c1,c2) {
    if(c1 !== null && c2 !== null)
      return c1._name.localeCompare(c2._name);
    else {
      if(c1 !== null && c2 == null)
        return -1;
      else
        return 0;  
    }
  }

  private equals(c1 : any,c2 : any) : boolean {
    return c1._name == c2._name && c1._fname == c2._fname;
  }
}
