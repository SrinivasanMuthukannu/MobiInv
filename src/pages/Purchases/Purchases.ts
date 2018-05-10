import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddPurchasedataPage } from '../add-purchasedata/add-purchasedata';
import { EditPurchasedataPage } from '../edit-purchasedata/edit-purchasedata';

@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'Purchases.html',
})
export class PurchasesPage {
  
ItemsList: any = [];
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
       db.executeSql('CREATE TABLE IF NOT EXISTS Invoices(rowid INTEGER PRIMARY KEY AUTOINCREMENT,InvoiceId TEXT, ClientId INTEGER,Date TEXT,Status TEXT,Type TEXT)', {})
      .then(res => console.log('Executed SQL  Invoices'))
      .catch(e => console.log(e));      
      db.executeSql('SELECT * FROM Invoices ORDER BY rowid DESC', {})
      .then(res => {
        this.ItemsList = [];
        for(var i=0; i<res.rows.length; i++) {
          this.ItemsList.push({rowid:res.rows.item(i).rowid,InvoiceId:res.rows.item(i).InvoiceId,Date:res.rows.item(i).Date})
        }        
      })   
    }).catch(e => console.log(e));
  }
  
  addData() {
   this.navCtrl.push(AddPurchasedataPage);   
  }
  
  editData(rowid) {
    this.navCtrl.push(EditPurchasedataPage, {
      rowid:rowid
    });
  }
  
  deleteData(rowid) {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM Invoices WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

}
