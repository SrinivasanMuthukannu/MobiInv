import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-add-purchasedata',
  templateUrl: 'add-purchasedata.html',
})
export class AddPurchasedataPage {

  data = {Name:"",Email:"",Mobile:"",Addr1:"",Addr2:"",Addr3:"" };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {}

  saveData() {
    this.sqlite.create({
      name: 'MobiInv.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO Clients(Name,Email,Mobile,Addr1,Addr2,Addr3) VALUES(?,?,?,?,?,?)',[this.data.Name,this.data.Email,this.data.Mobile,this.data.Addr1,this.data.Addr2,this.data.Addr3])
        .then(res => {
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

}