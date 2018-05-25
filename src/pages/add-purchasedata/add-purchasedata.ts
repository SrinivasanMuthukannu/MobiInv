import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,ActionSheetController } from 'ionic-angular';
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
  ItemsEdit : Item[]; 
  Clients: Client[];
  ClientSelected: Client;  
  public subtotal : number = 0;
  public invoiceId : string;
  public invoicedate : string;
  public flg : string;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast, public platform: Platform,
    public actionsheetCtrl: ActionSheetController) {
      this.flg = navParams.get("flag");         
      if(this.flg=="A"){  
        this.getinvoiceId(navParams.get("type"));
      }
      else
      { 
        console.log("Edit");
        this.invoiceId =  navParams.get("InvoiceId");     
       this.getEdititemData(navParams.get("rowid"),navParams.get("InvoiceId"));
       this.getEditClientData(navParams.get("rowid"),navParams.get("InvoiceId"));
       this.setData(this.ItemsEdit,this.Clients);
      }
      this.getitemData();
      this.getclientData();
    }
    setData(items,clients)
    {
     this.ItemSelected = items;
     this.ClientSelected = clients;
    }

    getEditClientData(rowid,invoiceId)
    {
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => { 
        db.executeSql('SELECT A.rowid,A.Name FROM Clients as A  INNER JOIN  Invoices as B ON A.rowid = B.ClientId where B.rowid = ? and B.InvoiceId = ? ',[rowid,invoiceId])
        .then(res => {  
          this.Clients = [];      
          for(var i=0; i<res.rows.length; i++) {
            this.Clients.push({id:res.rows.item(i).rowid,name:res.rows.item(i).Name})
            //this.ClientSelected.id = res.rows.item(i).rowid;
            //this.ClientSelected.name = res.rows.item(i).Name;            
            console.log("Edited Clients");
          }  
                 
        })   
      }).catch(e => console.log(e));
    }

    getEdititemData(rowid,InvoiceId)
    {
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => {                 
        db.executeSql('SELECT A.rowid,A.InvoiceId,A.Date,B.Rate,B.Qty,B.Tax,C.description,C.code FROM Invoices as A INNER JOIN  InvoiceDetail  as B  ON A.InvoiceId = B.InvoiceId INNER JOIN Items as C ON C.rowid =  B.ItemId where A.InvoiceId=? and A.rowid=?', [InvoiceId,rowid])
        .then(res => {          
          this.ItemsEdit = [];                 
          for(var i=0; i<res.rows.length; i++) {
            console.log("Edited items");
            this.ItemsEdit.push({id:res.rows.item(i).rowid,name:res.rows.item(i).description,code:res.rows.item(i).code,rate:res.rows.item(i).Rate,qty:res.rows.item(i).Qty,tax:res.rows.item(i).Tax})
            this.invoicedate = res.rows.item(i).Date;                         
          }
          
        }).catch(e => console.log(e));   
      }).catch(e => console.log(e));
    }

    getinvoiceId(type) {      
      this.sqlite.create({
        name: 'MobiInv.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT COALESCE(MAX(rowid)+1,1) as Rowid,date('now') as Invcdt FROM Invoices WHERE Type=?", [type])
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

openInvoice(items) {
  let actionSheet = this.actionsheetCtrl.create({
    title: 'Albums',
    cssClass: 'page-addpurchasedata',
    buttons: [
      {
        text: 'Save',
        role: 'destructive',
        icon: !this.platform.is('ios') ? 'cart' : null,
        handler: () => {          
          this.saveData(items);
          console.log('Save completed');
        }
      },
      {
        text: 'Share',
        icon: !this.platform.is('ios') ? 'share' : null,
        handler: () => {
          console.log('Share clicked');
        }
      },     
      {
        text: 'Cancel',
        role: 'cancel', // will always sort to be on the bottom
        icon: !this.platform.is('ios') ? 'close' : null,
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
}

saveData(items) {
  this.sqlite.create({
    name: 'MobiInv.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
   this.deleteData(this.navParams.get("rowid"),this.navParams.get("InvoiceId"));
    db.executeSql('INSERT INTO Invoices(InvoiceId,ClientId,Date,Status,Type) VALUES(?,?,?,?,?)',[this.invoiceId,this.ClientSelected.id,this.invoicedate,'Initiated',this.navParams.get("type")])
      .then(res => {
        if (items != null && items.length > 0) {      
          items.forEach(x => this.InsertData(x.Itemid,x.rate,x.qty,x.tax));
        }
        console.log("Inserted");
        this.toast.show('Data saved', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      })
      .catch(e => {
        console.log(e);
        this.toast.show(e, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      });
  }).catch(e => {
    console.log(e);
    this.toast.show(e, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
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
        console.log('Deleted InvoiceDetail ');       
      })
      .catch(e => console.log(e));        
    })
    .catch(e => console.log(e));
  }).catch(e => console.log(e));
}

InsertData(Itemid,Rate,Qty,tax) {
  this.sqlite.create({
    name: 'MobiInv.db',
    location: 'default'
  }).then((db: SQLiteObject) => {  
     db.executeSql('CREATE TABLE IF NOT EXISTS InvoiceDetail(InvoiceId TEXT,ItemId INT,Rate INT,Qty INT,Tax TEXT)', {})
    .then(res => console.log('Executed SQL  InvoicesDetails'))
    .catch(e => console.log(e));      
    db.executeSql('INSERT INTO InvoiceDetail(InvoiceId,ItemId,Rate,Qty,Tax) VALUES(?,?,?,?,?)',[this.invoiceId,Itemid,Rate,Qty,tax]) 
  }).catch(e => console.log(e));
}

}