import { Injectable, WritableSignal, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';
import { CapacitorSQLite, JsonSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';


//const DB_USERS = 'myuserdb';

/*export interface Vivencia {
  id: Number;
  titulo: string;
  fecha: string;
  descripcion: string;
  foto: string; // Ruta de la foto
  audio: string; // Ruta del audio
}*/

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;
  /*private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private vivencias: WritableSignal<Vivencia []> = signal<Vivencia []>([]);*/

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
/*
  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS vivencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      photo TEXT NOT NULL,
      audio TEXT NOT NULL
    );`;

    await this.db.execute(schema);
      this.loadVivencias();
      return true;
  }
  getVivencias(){
    return this.vivencias;
  }

  //CRUD
  async loadVivencias(){
    const vivencias = await this.db.query('SELECT * FROM vivencias');
    this.vivencias.set(vivencias.values || []);
  }

  async addVivencias(title: string, date: string, description: string, foto: string, audio: string){
    const query = `INSERT INTO vivencias (title, date, description, photo, audio) VALUES ('${title}', '${date}', '${description}', '${foto}', '${audio}')`;
    const result = await this.db.query(query);

    this.loadVivencias();
    return result;
  }

  async updateVivenciasById(id: string){
    const query = `UPDATE FROM vivencias WHERE id=${id}`;
    const result = await this.db.query(query);

    this.loadVivencias();
    return result;
  }

  async deleteVivencias(id: string){
    const query = `DELETE FROM vivencias WHERE id=${id}`;
    const result = await this.db.query(query);

    this.loadVivencias();
    return result;
  }
}
*/

