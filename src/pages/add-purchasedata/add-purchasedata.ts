import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { SelectSearchable } from 'ionic-select-searchable';
import { ItemseditPage } from '../Itemsedit/Itemsedit';

class Item {
  public id: number;
  public name: string;
  public code : string;
  public rate : number;
}

class Client {
  public id: number;
  public name: string;
}

@IonicPage()
@Component({
  selector: 'page-addpurchasedata',
  templateUrl: 'add-purchasedata.html',
})
export class AddPurchasedataPage {

  Items: Item[];
  ItemSelected: Item;  
  Clients: Client[];
  ClientSelected: Client;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {
      this.getitemData();
      this.getclientData();
    }

    getitemData() {
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => {  
         db.executeSql('CREATE TABLE IF NOT EXISTS Items(rowid INTEGER PRIMARY KEY, description TEXT, code TEXT,rate INT)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));      
        db.executeSql('SELECT * FROM Items ORDER BY rowid DESC', {})
        .then(res => {
          this.Items = [];
          for(var i=0; i<res.rows.length; i++) {
            this.Items.push({id:res.rows.item(i).rowid,name:res.rows.item(i).description,code:res.rows.item(i).code,rate:res.rows.item(i).rate})
          }
          
        })   
      }).catch(e => console.log(e));
    }

    getclientData() {
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => {  
         db.executeSql('CREATE TABLE IF NOT EXISTS Clients(rowid INTEGER PRIMARY KEY AUTOINCREMENT,Name TEXT,Email TEXT,Mobile TEXT,Addr1 TEXT,Addr2 TEXT,Addr3 TEXT)', {})
        .then(res => console.log('Executed SQL  clients'))
        .catch(e => console.log(e));      
        db.executeSql('SELECT * FROM Clients ORDER BY rowid DESC', {})
        .then(res => {
          this.Clients = [];
          for(var i=0; i<res.rows.length; i++) {
            this.Clients.push({id:res.rows.item(i).rowid,name:res.rows.item(i).Name})
          }          
        })   
      }).catch(e => console.log(e));
    }
  

  itemChange(event: { component: SelectSearchable, value: any }) {
    this.navCtrl.push(ItemseditPage, {
      Items:this.ItemSelected
    });
      console.log('items:', event.value);
      console.log('items',this.ItemSelected);
  }  
  clientChange(event: { component: SelectSearchable, value: any }) {
    console.log('clients:', event.value);
}  

}