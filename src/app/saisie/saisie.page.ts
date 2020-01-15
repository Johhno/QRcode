import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

interface EntityRecord {
  numCapteur: string;
  numEmplacement: string;
  etat: string
}

type BodyVisibilityValues = '1' | '0';

@Component({
  selector: 'app-saisie',
  templateUrl: './saisie.page.html',
  styleUrls: ['./saisie.page.scss'],
})
export class SaisiePage {
  qrScan: any;
  saisieForm: FormGroup;
  messagesDeValidation: any;

  num_capteur: string;
  num_emplacement: string;
  etat:string;
  recordList: EntityRecord[];

  pages = new Array('900A00','900A01');

  constructor(
    private router: Router,
    private storage: Storage,
    //public navCtrl: NavController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog: Dialogs,
    public platform: Platform,
    private sqlitePorter: SQLitePorter,
    private http: HttpClient,
    private sqlite: SQLite
  ) {
    this.initForm();
    this.initValidationMessages();
    this.recordList = [];
    for (let index = 0; index < this.pages.length; index++) {
      //any custom logic
      this.pages['index'] = index;    
    }
  }

  ngOnDestroy(): void {
    this.qrScan.unsubsribe();
  }

  /**
   * Initialise le formulaire.
   */
  private initForm(): void {
    this.saisieForm = this.formBuilder.group({
      num_capteur: ['', this.idCapteurValidators()],
      num_emplacement: ['', Validators.required]
    });
  }

  /**
   * @returns validateurs du champs "num_capteur".
   */
  private idCapteurValidators(): any {
    return Validators.compose([
      Validators.pattern("^(?:@[a-zA-Z0-9][a-zA-Z0-9]*/)?[a-zA-Z0-9][a-zA-Z0-9]*$"),
      Validators.required
    ]);
  }

  /**
   * Initialise chaque message de validation du formulaire.
   */
  private initValidationMessages(): void {
    this.messagesDeValidation = {
      'num_capteur': [
        //{ type: 'required', message: 'Identifiant du capteur requis.' },
        //{ type: 'pattern', message: 'Le format doit être alphnumériques.' }
      ],
      'num_emplacement': [
        //{ type: 'required', message: 'Emplacement requis.' }
      ]
    };
  }

  /**
   * Saves user inputs into the database.
   */
  saveFormData(): void {
    if (this.saisieForm.invalid) {
      // TODO: Display warning message for the user.
      alert('Échec Sauvegarde des données')
      return;
    }

    const newEntityRecord: EntityRecord = {
      numCapteur: this.num_capteur,
      numEmplacement: this.num_emplacement,
      etat:this.etat
    };

    // put record in array recordList
    this.recordList.push(newEntityRecord);

    this.saveEntityLine(this.recordList);

    //condition : si donnée existante demande ecrasement sinon sauvegarde
    this.onSuccessfulRecordSave();
  }

  /**
   * Saves a new record.
   *
   * @param record The record to save.
   */
  private async saveEntityLine(recordList: EntityRecord[]): Promise<void> {
    console.log('entity record', recordList)
    await this.storage.set('recordList', recordList);
  }

  /**
   * Runs when we have successfully save an entity record.
   */
  private onSuccessfulRecordSave(): void {
    this.presentSuccessfullySavedData();
    this.router.navigate(["/saisie"]);
  }

  getData(): void{
    let a = this.getEntityLine();
  }

  /**
   * Get records.
   *
   * @param record The record to get.
   */
  private async getEntityLine(): Promise<void> {
    let recordList =   await this.storage.get('recordList');
      console.log('recordList',recordList);
      
  }

  /**
   * Set one record.
   *
   * @param record Set one record.
   */
  private async updateEntityLine(key: EntityRecord['numCapteur'], value:EntityRecord['numEmplacement']): Promise<void> {
    let recordList =   await this.storage.get('recordList');
    console.log('recordList',recordList);
    console.log('numCapteur',key);console.log('numEmplacement',value);
    //await this.storage.set('recordList', recordList);
  }

  /**
   * Delete one record.
   *
   * @param record Set one record.
   */
  private async deleteEntityLine(key: EntityRecord['numCapteur'], value:EntityRecord['numEmplacement']): Promise<void> {
    let recordList =   await this.storage.remove('recordList');
  }

  /**
   * @returns an alert informing the user that data have been saved successfully.
   */
  async presentSuccessfullySavedData(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Succès de l\'enregistrement',
      message: 'Les données ont été sauvegardées avec succès.',
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Demande si écrasement ou annulation
   * @returns an alert informing the user that data have already been save. 
   */
  async presentExistedData(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Données existantes',
      message: 'Les données ont déjà été sauvegardées. Voulez vous ecraser la sauvegarde?',
      buttons: ['Oui','Non']
    });

    await alert.present();
  }
  private toggleBodyVisibility(val: BodyVisibilityValues): void {
    document.getElementsByTagName("body")[0].style.opacity = val;
  }

  /**
   * Débute le scan
   */
  startScanning(): void {
    this.qr.prepare()
    .then((status:QRScannerStatus) => {
      if (status.authorized) {
        this.qr.scan();
        this.qr.show();

        this.toggleBodyVisibility('0');

        this.qrScan = this.qr.scan().subscribe(this.onScanSuccess(), this.onScanError());
      }
       else if (status.denied) {
        console.log("Accès Caméra refusé");
      }
      else {
        //Camera refusé mais peut demander l'accès plus tard
        // TODO: demander permission à l'utilisateur
      }
    });
  }

  /**
   * Met la valeur scanné dans le champs
   */
  private onScanSuccess(): (res) => void {
    return (textFound) => {
      this.toggleBodyVisibility('1');

      if (this.num_capteur != "") {
        this.num_capteur = textFound;
        this.qrScan.hide();
        this.qrScan.unsubsribe();
      }
    }
  }

  private onScanError(): (err) => void {
    return (err) => {
      this.dialog.alert(JSON.stringify(err));
    };
  }

}