import { Component } from '@angular/core';
import {IonicPage, ViewController,NavParams} from 'ionic-angular';
import {ContactComponent} from "../../components/contact/contact";

/**
 * Generated class for the AddContactPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage {

  public _user : ContactComponent = ContactComponent.get_default();
  public _add : boolean;

  constructor( public viewCtrl : ViewController,params: NavParams) {
    this._add = params.get('add');
    if(params.get('contact') == undefined)
      console.log("You're about to add someone !");
    else
      this._user = params.get('contact');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactPage');
  }

  /**
   * Use to close the Modal
   */
  public close() : void {
    this.viewCtrl.dismiss(null);
  }

  /**
   * Use to dispatch the Content of modal to home that will handle the add
   */
  public add(): void  {
    this.viewCtrl.dismiss(this._user);
  }

  public update() : void{
    console.log(this._user);
    this.viewCtrl.dismiss(this._user);
  }
}
