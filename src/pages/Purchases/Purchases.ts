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
      db.executeSql('SELECT A.rowid,A.InvoiceId,A.Date,B.Total,A.ClientId FROM Invoices as A INNER JOIN (SELECT InvoiceId,Sum(Rate * Qty) as Total from InvoiceDetail group by InvoiceId ) as B  ON A.InvoiceId = B.InvoiceId ', {})
      .then(res => {
        this.ItemsList = [];        
        for(var i=0; i<res.rows.length; i++) {          
          this.ItemsList.push({rowid:res.rows.item(i).rowid,InvoiceId:res.rows.item(i).InvoiceId,Date:res.rows.item(i).Date,Total:res.rows.item(i).Total})
        } 
      }).catch(e => console.log(e));   
    }).catch(e => console.log(e));
  }
  
  addData() {
   this.navCtrl.push(AddPurchasedataPage,{
    type:"P"
   });   
  }
  
  editData(rowid) {
    this.navCtrl.push(EditPurchasedataPage, {
      rowid:rowid
    });
  }
  
  deleteData(rowid,InvoiceId) {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM Invoices WHERE rowid=? and InvoiceId=?', [rowid,InvoiceId])
      .then(res => {
        db.executeSql('DELETE FROM InvoiceDetail WHERE InvoiceId=?', [InvoiceId])
        .then(res1=>{
          this.getData();
          console.log('Deleted InvoiceDetail ');       
        })
        .catch(e => console.log(e));        
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

}
