import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform, AlertController, ToastController } from '@ionic/angular';
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
  //etat: string;
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
  updateForm: FormGroup;
  messagesDeValidation: any;

  num_capteur: string;
  num_emplacement: string;
  etat: string;
  recordList: EntityRecord[];
  array_emplacements = new Array('900A00','900A01','900A02','900A03','900A04','900A05','900A06','900A07','900A08','900A09','900A10','900A11','900A12','900A13','900A14',
  '900A15','900A16','900A17','900A18','900A19','900A20','900A21','900A22','900A23','900A24','900A25','900A26','900A27','900A28','900A29','900A30','900A31','900A32',
  '900A33','900A34','900A35','900A36','900A37','900A38','900A39','900A40','900A41','900A42','900A43','900A44','900A45');

  constructor(
    private router: Router,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog: Dialogs,
    public platform: Platform,
    //private sqlitePorter: SQLitePorter,
    private http: HttpClient,
    private sqlite: SQLite
  ) {
    this.initForm();
    this.initFormUpdate();
    this.initValidationMessages();
    this.initArrayEmplacements();
    this.initRecordList();
  }

  private async initRecordList(): Promise<void> {
    this.recordList = [];
    this.recordList = await this.getEntityLines();
  }

  /**
   * Get recordS.
   *
   * @param record The recordS to get.
   */
  private async getEntityLines(): Promise<EntityRecord[]> {
    const recordListFromStorage = await this.storage.get('recordList') ;
    console.log('recordList from storage', recordListFromStorage);

    return recordListFromStorage ? recordListFromStorage : [] ;
  }

  ngOnDestroy(): void {
    this.qrScan.unsubsribe();
  }

  /**
   * Displays an alert describing the details of the given record.
   *
   * @param record The record to show details of.
   */
  async showDetails(record: EntityRecord): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: 'Le capteur est ' + record.numCapteur + ' et  son emplacement est ' + record.numEmplacement,
      buttons: ['OK']
    });

    await toast.present();
  }

  /**
   * @returns instancie tableau d'emplacements.
   */
  private initArrayEmplacements(): any {
    for (let index = 0; index < this.array_emplacements.length; index++) {
      //any custom logic
      this.array_emplacements['index'] = index;    
    }
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

  private initFormUpdate(): void {
    /*this.updateForm = this.formBuilder.group({
      num_capteur: ['', this.idCapteurValidators()],
      num_emplacement: ['', Validators.required]
    });*/
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
      //etat:this.etat = "1"
    };

    //parcours le tableau et cherche si le capteur a déjà été enregistré
    // put record in array recordList

    console.log(this.recordList)
    this.recordList.push(newEntityRecord);

    this.saveEntityLine(this.recordList);

    console.log(this.recordList)

    //condition : si donnée existante demande ecrasement sinon sauvegarde
    this.onSuccessfulRecordSave();
  }

  /**
   * Saves a new record.
   *recordList
   * @param record The record to save.
   */
  private async saveEntityLine(recordList: EntityRecord[]): Promise<void> {
    console.log('entityRecord', recordList)
    await this.storage.set('recordList', recordList);
  }

  /**
   * Runs when we have successfully save an entity record.
   */
  private onSuccessfulRecordSave(): void {
    this.presentSuccessfullySavedData();
    this.num_capteur = "";
    this.num_emplacement = "";
    this.router.navigate(["/saisie"]);
  }



  /**
   * Set one record.
   *
   * @param record Set one record.
   */
  private updateEntityLine(index,capteur : any, emplacement : any) {
          //chercher par index
          this.recordList[index].numCapteur = capteur;
          this.recordList[index].numEmplacement = emplacement;

          // TODO : utliser un service pour le storage

          this.storage.set('recordList',this.recordList)
  }

  /**
   * Delete one record.
   *
   * @param record Delete one record.
   */
  private  deleteEntityLine(index) {
    this.recordList.splice(index,1)
 // TODO : utliser un service pour le storage
    this.storage.set('recordList',this.recordList)
  }

  /**
   * @returns an alert informing the user that data have been saved successfully.
   */
  async presentSuccessfullySavedData(): Promise<void> {
    const toast = await this.toastCtrl.create({
      
      header: "Succès de l'enregistrement",
      message: 'Le QR Code '+ this.num_capteur + ' est correctement lié à l\'emplacement ' + this.num_emplacement,
      buttons: ['OK']
    });

    await toast.present();
  }

  /**
   * Demande si écrasement ou annulation
   * @returns an alert informing the user that data have already been save. 
   */
  async presentExistedData(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Données existantes',
      message: 'Les données ont déjà été sauvegardées. \nVoulez vous écraser la sauvegarde ?',
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
   * Met la valeur scannée dans le champ
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