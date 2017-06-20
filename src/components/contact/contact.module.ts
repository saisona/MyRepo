import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ContactComponent } from './contact';

@NgModule({
  declarations: [
    ContactComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ContactComponent
  ]
})
export class ContactComponentModule {}
