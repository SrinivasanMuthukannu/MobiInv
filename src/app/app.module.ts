import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AddItemdataPage } from '../pages/add-itemdata/add-itemdata';
import { EditItemdataPage } from '../pages/edit-itemdata/edit-itemdata';
import { AddClientdataPage } from '../pages/add-clientdata/add-clientdata';
import { EditClientdataPage } from '../pages/edit-clientdata/edit-clientdata';
import { AddPurchasedataPage } from '../pages/add-purchasedata/add-purchasedata';
import { EditPurchasedataPage } from '../pages/edit-purchasedata/edit-purchasedata';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { ItemseditPage } from '../pages/Itemsedit/Itemsedit';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AddItemdataPage,
    EditItemdataPage,
    AddClientdataPage,
    EditClientdataPage,
    AddPurchasedataPage,
    EditPurchasedataPage,
    ItemseditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SelectSearchableModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AddItemdataPage,
    EditItemdataPage,
    AddClientdataPage,
    EditClientdataPage,
    AddPurchasedataPage,
    EditPurchasedataPage,
    ItemseditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast    
  ]
})
export class AppModule {}
