import { Injectable, WritableSignal, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';
import { CapacitorSQLite, JsonSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;

  constructor(private http: HttpClient) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this. isIOS= false;
    this.dbName = '';
   }
   
  async init(){
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if(info.platform == 'android'){
      try{
        await sqlite.requestPermissions();
      } catch(error){
        console.error("Esta app necesita permisos para funcionar");
      }

    }else if(info.platform =='web'){
      this.isWeb = true;
      await sqlite.initWebStore();

    }else if(info.platform =='ios'){
      this.isIOS = true;
    }

    this.setupDatabase();
   }

   async setupDatabase(){
    const dbSetup = await Preferences.get({key: 'first_setup_key'})

    if(!dbSetup.value){
      this.downloadDataBase();
    }else{
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({database: this.dbName});
      await CapacitorSQLite.open({ database: this.dbName})
      this.dbReady.next(true);
    }
    }

    downloadDataBase(){
      this.http.get('/assets/db/db.json').subscribe(
        async (jsonExport: JsonSQLite) =>{

          const jsonstring = JSON.stringify(jsonExport);
          const isValid = await CapacitorSQLite.isJsonValid({jsonstring});

          if(isValid.result){
            this.dbName = jsonExport.database;
            await CapacitorSQLite.importFromJson({jsonstring});
            await CapacitorSQLite.createConnection({database: this.dbName});
            await CapacitorSQLite.open({ database: this.dbName})

            await Preferences.set({key: 'first_setup_key', value: '1'})
            await Preferences.set({key: 'dbname', value: this.dbName})

            this.dbReady.next(true);
          }
      })
    }

    async getDbName(){
      if(!this.dbName){
        const dbname = await Preferences.get({key: 'dbname'})
        if(dbname.value){
          this.dbName = dbname.value
        }
      }
      return this.dbName;
    }
}

