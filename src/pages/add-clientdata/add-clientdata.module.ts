import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClientdataPage } from './add-clientdata';

@NgModule({
  declarations: [
    AddClientdataPage,
  ],
  imports: [
    IonicPageModule.forChild(AddClientdataPage),
  ],
})
export class AddClientdataPageModule {}
