import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddItemdataPage } from './add-itemdata';

@NgModule({
  declarations: [
    AddItemdataPage,
  ],
  imports: [
    IonicPageModule.forChild(AddItemdataPage),
  ],
})
export class AddItemdataPageModule {}
