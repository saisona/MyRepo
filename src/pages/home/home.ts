import {Component} from '@angular/core';
import { ModalController, Platform, ToastController,AlertController} from 'ionic-angular';
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
  private initializedContacts: any[];
  protected _searchValue: string = "";
  protected gettingData: boolean;
  protected isSync: boolean;

  private _searchControl: FormControl;

  constructor(public firebase: FirebaseProvider, public modalCtrl: ModalController, public toastCtrl: ToastController, public alertCtrl:AlertController, private platform: Platform, protected storageIonic: Storage) {
    this.gettingData = true;
    // this.storageIonic.ready().then(storage => {
    //   storage.getItem('contacts').then((vls : any[]) => {
    //     console.log("ENTER constructor =>",vls);
    //     if(vls !== null && vls !== undefined ) {
    //       vls.sort(this.sort_function);
    //       this.contacts = vls;
    //       this.initializedContacts = vls;
    //     }
    //     else{
    //       this.initializedContacts = [];
    //       this.contacts = [];
    //     }
    //     this.gettingData = false;
    //   });
    // });
    this.firebase.getContacts().subscribe(contacts => {
      this.contacts = contacts;
      this.initializedContacts = contacts;
      this.gettingData = false;
    })
    this._searchControl = new FormControl();
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

  private filterItems(searchTerm) {
    if (searchTerm == "")
      return this.initializedContacts;
    else
      return this.initializedContacts.filter((item : any) => {
        console.log(item);
        return item._name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item._fname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }


  selectItem(c: ContactComponent): void {
    let modal = this.modalCtrl.create(DetailsContactPage, {contact: c});
    modal.present();
  }


  deleteItem(c: any) {
        this.firebase.deleteContact(c.$key).then(() => {
          let toast = this.toastCtrl.create({
            message: c.name + " " + c.fname + " a été supprimé !",
            duration: 1500,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });
          toast.present();
        })    
        // this.storageIonic.ready().then(storage => {
        //   storage.getItem('contacts').then((contacts : any[]) => {
        //     let index_to_delete = -1;
        //     console.log("ENTER FINDING TO DELETE !", contacts);
        //     for(let index=0; index < contacts.length; index++) {
        //         console.log(c,contacts[index]);
        //         if(this.equals(contacts[index],c)) {
        //           console.log("ENTER FOUND !");
        //           index_to_delete = index;
        //           break;
        //         }
        //     }
        //     if(index_to_delete !== -1)
        //       contacts.splice(index_to_delete,1);
        //     else {
        //       alert("[ERROR] cannot find the index of the contact to delete !");
        //       console.log("CANNOT FIND THE CONTACT TO DELETE")
        //     }

        //     storage.setItem('contacts', contacts);
        //     this.contacts = contacts;
        //     this.initializedContacts = contacts;
        //   })
        // });
  }


  addItem(): void {
    let modal = this.modalCtrl.create(AddContactPage, {add: true});

    modal.onDidDismiss((contact: ContactComponent) => {
      if (contact !== null) {
        console.log(contact);
        contact.fp = this.firebase;
        contact.save().then(() => {
          let toast = this.toastCtrl.create({
            message: "Le contact a été ajouté",
            duration: 1500,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });
          toast.present();
        }).catch(err => {
          console.log(err);
          alert("There was an ERROR !");
        });
        // this.storageIonic.ready().then(storage => {
        //   storage.getItem('contacts').then((contacts : ContactComponent[]) => {
        //     if(contacts === null) {
        //       contacts = [];
        //     }
        //     contacts.push(contact);
        //     contacts.sort(this.sort_function);

        //     storage.setItem('contacts', contacts);
        //     this.contacts = contacts;
        //     this.initializedContacts = contacts;
        //   })
        // });
      }
      else
        console.log("You have cancelled the action ! OR CLOSED ");
    });
    modal.present();
  }


  updateItem(c: any) {
    let c_update = {
      contact: {
        name: c._name,
        fname: c._fname,
        address: {city: c._address._city, cp: c._address._cp, street: c._address._street},
        $key: c.$key || null,
        notes: c._notes
      },
      add: false
    };
    console.log(c_update);
    let index_found_contact_in_list = this.findContact(this.contacts,c_update.contact);
    console.log(`INDEX => ${index_found_contact_in_list}`);
    let modal = this.modalCtrl.create(AddContactPage, c_update);
    modal.onDidDismiss((contact: any) => {
        // this.storageIonic.ready().then(storage => {
        //     storage.getItem('contacts').then((contacts : ContactComponent[]) => {
        //         
        //       if(index_found_contact_in_list !== -1)
        //         contacts[index_found_contact_in_list] = contact;
        //       else
        //         console.log("Index to update is not defined => CONTACT NOT FOUND !");
        //       contacts.sort(this.sort_function);
        //       storage.setItem('contacts', contacts);
        //       this.contacts = contacts;
        //       this.initializedContacts = contacts;
        //   });
        // });
        contact = {
          _name: contact.name,
          _fname: contact.fname,
          _address: {_city: contact.address.city, _cp: contact.address.cp, _street: contact.address.street},
          $key: contact.$key || null,
          _notes: contact.notes
        };
        console.log("Contact to update => ", contact);
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
    });
       
    modal.present();
  }


  sync() {
    let alert = this.alertCtrl.create({
      title: 'Synchronisation',
      message: 'Quel mode de Synchronisation ?',
      buttons: [
        {
          text: 'Depuis Internet',
          handler: () => {
            this.isSync = true;
            this.firebase.getContacts().subscribe(contacts => {
              this.contacts = contacts;
              this.initializedContacts = contacts;
              this.isSync = false;
              let toast = this.toastCtrl.create({
                message: "Synchronisation terminée !",
                duration: 1500,
              });
              toast.present();
            })
          }
        },
        {
          text: 'Vers Internet',
          handler: () => {
            this.isSync = true;
            this.checkNetwork().then(isConnected => {
              let toast;
              if (isConnected) {
                this.firebase.sync(this.initializedContacts).then(() => {
                  toast = this.toastCtrl.create({
                    message: "Synchronisation terminée !",
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
        }
      ]
    });
    alert.present();
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

  // private sort_function(c1,c2) {
  //   if(c1 !== null && c2 !== null)
  //     return c1._name.localeCompare(c2._name);
  //   else {
  //     if(c1 !== null && c2 == null)
  //       return -1;
  //     else
  //       return 0;  
  //   }
  // }

  private equals(c1 : any,c2 : any) : boolean {
    console.log(c1._name, c2._name );
    console.log(c1._fname,c2._fname);
    return c1._name == c2._name && c1._fname == c2._fname;
  }

  private findContact(list : any[],contact : any) {
    let found : boolean = false;
    let i : number = 0;
    let found_index : number = -1;
    contact = {_name : contact.name,_fname : contact.fname};
    while(i < list.length && !found) {
      if(this.equals(contact,list[i])) {
        found_index = i;
        found = true;
      }
      i++;
    }
    return found ? found_index : -1;
  } 
}
