import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AddContactPage} from '../pages/add-contact/add-contact';
import {DetailsContactPage} from '../pages/details-contact/details-contact';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase} from "angularfire2/database";
import { ContactComponent} from '../components/contact/contact';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { ElasticDirective } from '../directives/elastic/elastic';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDD_pp7hAmCHFOM8xdUYB-NnxLuHrceQ9M",
  authDomain: "dadrepo.firebaseapp.com",
  databaseURL: "https://dadrepo.firebaseio.com",
  projectId: "dadrepo",
  storageBucket: "dadrepo.appspot.com",
  messagingSenderId: "722118309180"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddContactPage,
    ContactComponent,
    DetailsContactPage,
    ElasticDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: [ 'sqlite','indexeddb', 'websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddContactPage,
    HomePage,
    ContactComponent,
    DetailsContactPage
  ],
  providers: [
    StatusBar,
    AngularFireAuth,
    AngularFireDatabase,
    SplashScreen,
    FirebaseProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalStorageProvider
  ]
})
export class AppModule {}
