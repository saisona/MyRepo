import {Component} from '@angular/core';
import {ModalController, ToastController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {ContactComponent} from '../../components/contact/contact';
import {AddContactPage} from "../add-contact/add-contact";
import {DetailsContactPage} from '../details-contact/details-contact';
import {FirebaseListObservable} from "angularfire2/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected contacts: FirebaseListObservable<any>;



  constructor(public firebase: FirebaseProvider, public modalCtrl: ModalController, public toastCtrl : ToastController) {
    this.contacts = this.firebase.getContacts();
  }


  public selectItem(c: ContactComponent): void {
    //TODO : HANDLE CHANGE VIEW !
    let modal = this.modalCtrl.create(DetailsContactPage,{contact : c});
    modal.present();
  }

  public deleteItem(c : any) {
    let contact = {name : c.name , fname : c.fname};
    this.firebase.deleteContact(c.$key).then(() => {
      let toast = this.toastCtrl.create({
        message: contact.name +" " + contact.fname + " a été supprimé !",
        duration: 1500,
        showCloseButton : true,
        closeButtonText : 'Ok'
      });
      toast.present();
    })
  }

  public addItem() : void {
    let modal = this.modalCtrl.create(AddContactPage);

    modal.onDidDismiss((contact:ContactComponent) => {
      if(contact !== null){
        contact.fp = this.firebase;
        contact.save().then(() => {
          let toast = this.toastCtrl.create({
            message: "Le contact a été ajouté",
            duration: 1500,
            showCloseButton : true,
            closeButtonText : 'Ok'
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
  public updateItem(c : any) {
    console.log(c);
    let modal = this.modalCtrl.create(AddContactPage,{contact : c, add : false});
    modal.onDidDismiss((contact:ContactComponent) => {
        contact.fp = this.firebase;
        console.log()
        // contact.update(contact).then(() => {
        //   let toast = this.toastCtrl.create({
        //     message: "Le contact a été modifié",
        //     duration: 1500,
        //     showCloseButton : true,
        //     closeButtonText : 'Ok'
        //   });
        //   toast.present();
        // }).catch(err => {
        //   console.log(err);
        //   alert("There was an ERROR !");
        // });
    });
    modal.present();
  }
}
