import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { ContactComponent } from "../../components/contact/contact";

/**
 * Generated class for the DetailsContactPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-details-contact',
  templateUrl: 'details-contact.html',
})
export class DetailsContactPage {

  protected _user: ContactComponent;

  constructor(public viewCtrl: ViewController, params: NavParams) {
    console.log(params.get('contact'));
    this._user = params.get('contact');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsContactPage');
  }

  public close(): void {
    this.viewCtrl.dismiss(null);
  }

}
