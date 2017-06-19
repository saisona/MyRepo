import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  public _isAuth :boolean = false;


  constructor(public navCtrl: NavController, public firebase : FirebaseProvider) {}

  public isAuth() {
    return this._isAuth;
  }

  public onChangeAuth() : void {
    this.firebase.onAuth();
  }




}
