import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

class Item {
  public id: number;
  public name: string;
  public code : string;
  public rate : number;
  public qty : number;
  public tax :boolean;
}

@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'Itemsedit.html',
})
export class ItemseditPage {
  
ItemsList:Item[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlite: SQLite) {    
    this.initializeItems(navParams.get("Items"));
  }

  initializeItems(Items): void {
    this.ItemsList = Items;
    console.log('itemedit',Items);
  }


}
