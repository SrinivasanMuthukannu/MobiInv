import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddItemdataPage } from '../add-itemdata/add-itemdata';
import { EditItemdataPage } from '../edit-itemdata/edit-itemdata';

@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'Items.html',
})
export class ItemsPage {
  
ItemsList: any = [];
LoadedItemsList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlite: SQLite) {    
  }

  ionViewDidLoad() {
    this.getData();
  }
  ionViewWillEnter() {
    this.getData();
  }
  
  getData() {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {  
       db.executeSql('CREATE TABLE IF NOT EXISTS Items(rowid INTEGER PRIMARY KEY, description TEXT, code TEXT,rate INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));      
      db.executeSql('SELECT * FROM Items ORDER BY rowid DESC', {})
      .then(res => {
        this.ItemsList = [];
        for(var i=0; i<res.rows.length; i++) {
          this.ItemsList.push({rowid:res.rows.item(i).rowid,description:res.rows.item(i).description,code:res.rows.item(i).code,rate:res.rows.item(i).rate})
        }
        this.LoadedItemsList=this.ItemsList;
      })   
    }).catch(e => console.log(e));
  }

  initializeItems(): void {
    this.ItemsList = this.LoadedItemsList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();  
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }  
    this.ItemsList = this.ItemsList.filter((v) => {
      if(v.description && q) {
        if (v.description.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });  
    console.log(q, this.ItemsList.length);  
  }
  
  addData() {
   this.navCtrl.push(AddItemdataPage);
   // this.navCtrl.setRoot(AddItemdataPage);
  }
  
  editData(rowid) {
    this.navCtrl.push(EditItemdataPage, {
      rowid:rowid
    });
  }
  
  deleteData(rowid) {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM Items WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

}
