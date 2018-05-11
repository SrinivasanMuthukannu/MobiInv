import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,ModalController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { SelectSearchable } from 'ionic-select-searchable';



class Item {
  public id: number;
  public name: string;
}

@IonicPage()
@Component({
  selector: 'page-add-purchasedata',
  templateUrl: 'add-purchasedata.html',
})
export class AddPurchasedataPage {

  Items: Item[];
  ItemSelected: Item;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {
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
          this.Items = [];
          for(var i=0; i<res.rows.length; i++) {
            this.Items.push({id:res.rows.item(i).rowid,name:res.rows.item(i).description})
          }
          
        })   
      }).catch(e => console.log(e));
    }
  

    itemChange(event: { component: SelectSearchable, value: any }) {
      console.log('port:', event.value);
  }  

}