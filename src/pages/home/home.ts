import {Component} from '@angular/core';
import {ModalController, ToastController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {ContactComponent} from '../../components/contact/contact';
import {AddContactPage} from "../add-contact/add-contact";
import {DetailsContactPage} from '../details-contact/details-contact';
import {FormControl} from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected contacts: any[];
  private initializedContacts : any[];
  protected _searchValue: string = "";
  protected gettingData: boolean;
  protected isSync : boolean;

  private _searchControl: FormControl;

  constructor(public firebase: FirebaseProvider, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.firebase.getContacts().subscribe((contacts) => {
      this.contacts = contacts.sort();
      this.initializedContacts = contacts.sort();
      this.gettingData = false;
    });
    this._searchControl = new FormControl();
    this.gettingData = true;
    this.isSync = false;
  }

  ionViewDidLoad() {
    this._searchControl.valueChanges.debounceTime(700).subscribe(() => {
      this.setFilteredItems();
    });
  }

  public setFilteredItems() {
    this.contacts = (this.filterItems(this._searchValue));
  }

  private filterItems(searchTerm) {
    console.log(searchTerm)
    if (searchTerm == "")
      return this.initializedContacts;
    else
      return this.initializedContacts.filter((item) => {
        console.log(`ITEM => `, item);
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.fname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }


  public selectItem(c: ContactComponent): void {
    let modal = this.modalCtrl.create(DetailsContactPage, {contact: c});
    modal.present();
  }

  public deleteItem(c: any) {
    let contact = {name: c.name, fname: c.fname};
    this.firebase.deleteContact(c.$key).then(() => {
      let toast = this.toastCtrl.create({
        message: contact.name + " " + contact.fname + " a été supprimé !",
        duration: 1500,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    })
  }

  public addItem(): void {
    let modal = this.modalCtrl.create(AddContactPage, {add: true});

    modal.onDidDismiss((contact: ContactComponent) => {
      if (contact !== null) {
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
      }
      else
        console.log("You have cancelled the action ! OR CLOSED ");
    });
    modal.present();
  }

  public updateItem(c: any) {
    let c_update = {
      contact: {
        name: c.name,
        fname: c.fname,
        address: {city: c.address._city, cp: c.address._cp, street: c.address._street},
        $key: c.$key,
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
  public sync() {
    this.isSync = true;
    setTimeout(() => {
      let toast = this.toastCtrl.create({
        message: "Synchronisation is conplete !",
        duration: 1500,
      });
      this.isSync = false
      toast.present();
    },3000);
    // this.firebase.sync(this.initializedContacts).then(() => this.isSync = false);
  }
}
