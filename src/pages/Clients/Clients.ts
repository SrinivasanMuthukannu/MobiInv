import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddClientdataPage } from '../add-clientdata/add-clientdata';
import { EditClientdataPage } from '../edit-clientdata/edit-clientdata';

@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'Clients.html',
})
export class ClientsPage {
  
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
       db.executeSql('CREATE TABLE IF NOT EXISTS Clients(rowid INTEGER PRIMARY KEY AUTOINCREMENT,Name TEXT,Email TEXT,Mobile TEXT,Addr1 TEXT,Addr2 TEXT,Addr3 TEXT)', {})
      .then(res => console.log('Executed SQL  clients'))
      .catch(e => console.log(e));      
      db.executeSql('SELECT * FROM Clients ORDER BY rowid DESC', {})
      .then(res => {
        this.ItemsList = [];
        for(var i=0; i<res.rows.length; i++) {
          this.ItemsList.push({rowid:res.rows.item(i).rowid,Name:res.rows.item(i).Name,Email:res.rows.item(i).Email,Mobile:res.rows.item(i).Mobile,Addr1:res.rows.item(i).Addr1,Addr2:res.rows.item(i).Addr2,Addr3:res.rows.item(i).Addr3})
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
      if(v.Name && q) {
        if (v.Name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });  
    console.log(q, this.ItemsList.length);  
  }
  
  addData() {
   this.navCtrl.push(AddClientdataPage);
   // this.navCtrl.setRoot(AddItemdataPage);
  }
  
  editData(rowid) {
    this.navCtrl.push(EditClientdataPage, {
      rowid:rowid
    });
  }
  
  deleteData(rowid) {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM Clients WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

}
