import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

interface EntityRecord {
  numCapteur: string;
  numEmplacement: string;
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

  constructor(
    private router: Router,
    private storage: Storage,
    //public navCtrl: NavController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog: Dialogs,
    public platform: Platform
  ) {
    this.initForm();
    this.initValidationMessages();
  }

  ngOnDestroy(): void {
    this.qrScan.unsubsribe();
  }

  /**
   * Initializes the form.
   */
  private initForm(): void {
    this.saisieForm = this.formBuilder.group({
      num_capteur: ['', this.idCapteurValidators()], 
      num_emplacement: ['', Validators.required]
    });    
  }

  /**
   * @returns validators for the id capteur field.
   */
  private idCapteurValidators(): any {
    return Validators.compose([
      Validators.pattern("^(?:@[a-zA-Z0-9][a-zA-Z0-9]*/)?[a-zA-Z0-9][a-zA-Z0-9]*$"),
      Validators.required
    ]);
  }

  /**
   * Initialize every validation messages of the form.
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
      numEmplacement: this.num_emplacement
    };

    this.saveEntityLine(newEntityRecord);
    this.onSuccessfulRecordSave();
  }

  /**
   * Saves a new record.
   *
   * @param record The record to save.
   */
  private async saveEntityLine(record: EntityRecord): Promise<void> {
    await this.storage.set(record.numCapteur, record);
    //console.log(await this.storage.get(record.numCapteur));
  }
  
  /**
   * Runs when we have successfully save an entity record.
   */
  private onSuccessfulRecordSave(): void {
    this.presentSuccessfullySavedData();
    this.router.navigate(["/saisie"]);
  }

  /**
   * @returns an alert informing the user that data have been saved successfully.
   */
  async presentSuccessfullySavedData(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: '',
      message: 'Les données ont été sauvegardées avec succès.',
      buttons: ['OK']
    });

    await alert.present();
  }

  getData(): void{
    //this.getEntityLine();
  }
  /**
   * Get records.
   *
   * @param record The record to get.
   */
  private async getEntityLine(record: EntityRecord): Promise<void> {
    // for(let i = 0 ; i<record.length ; i++){

    // }
    console.log(await this.storage.get(record.numCapteur));
  }
/*
  private async getEntityLines(): Promise<void> {
    // for(let i = 0 ; i<record.length ; i++){
      this.getEntityLine();
    // }
    
  }
*/
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
