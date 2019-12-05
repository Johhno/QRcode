import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';


export interface CapteurInterface{
  id: number,
  matricule: string,
  emplacement: string
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //Listener Connexion
  capteursBS = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient) { 

      this.platform.ready().then(() => {
        this.sqlite.create({
          name: 'capteur.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase();
        });
      });
    }

    seedDatabase() {
      this.http.get('assets/seed.sql', { responseType: 'text'})
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadCapteurs();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
    }
    getDatabaseState() {
      return this.dbReady.asObservable();
    }
   
    getCapteurs(): Observable<CapteurInterface[]> {
      return this.capteursBS.asObservable();
    }

    loadCapteurs() {
      return this.database.executeSql('SELECT * FROM capteur', []).then(data => {
        let capteurs: CapteurInterface[] = [];
   
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            capteurs.push({ 
              id: data.rows.item(i).id,
              matricule: data.rows.item(i).matricule, 
              emplacement: data.rows.item(i).emplacement,
             });
          }
        }
        this.capteursBS.next(capteurs);
      });
    }

    addCapteur(matricule, emplacement) {
      let data = [matricule, emplacement];
      return this.database.executeSql('INSERT INTO capteur (matricule, emplacement) VALUES (?, ?)', data).then(data => {
        this.loadCapteurs();
      });
    }
}
