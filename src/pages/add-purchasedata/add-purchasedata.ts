import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { SelectSearchable } from 'ionic-select-searchable';
import { ItemseditPage } from '../Itemsedit/Itemsedit';
import { GESTURE_PRIORITY_GO_BACK_SWIPE } from 'ionic-angular/gestures/gesture-controller'

class Item {
  public id: number;
  public name: string;
  public code : string;
  public rate : number;
  public qty : number;
  public tax :boolean;
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
  public subtotal : number = 0;
  public invoiceId : string;
  public invoicedate : string;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {
      this.getitemData();
      this.getclientData();      
      this.getinvoiceId(navParams.get("type"));
    }

    getinvoiceId(type) {      
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT COALESCE(MAX(rowid)+1,1) as Rowid,date('now') as Invcdt FROM Invoices WHERE (InvoiceId LIKE ? )", [type+'%'])
        .then(res => {
          for(var i=0; i<res.rows.length; i++) {
            this.invoiceId =type+res.rows.item(i).Rowid;
           this.invoicedate = res.rows.item(i).Invcdt;
          } 
          console.log("Date");          
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
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
            this.Items.push({id:res.rows.item(i).rowid,name:res.rows.item(i).description,code:res.rows.item(i).code,rate:res.rows.item(i).rate,qty:1,tax:true})
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
     
  }  
  clientChange(event: { component: SelectSearchable, value: any }) {
    //console.log('clients:', event.value);
}

public Subtotal(items){
  this.subtotal = 0;
  if (items != null && items.length > 0) {      
    items.forEach(x => this.subtotal += (x.qty*x.rate));
  }
  return this.subtotal;
}


}