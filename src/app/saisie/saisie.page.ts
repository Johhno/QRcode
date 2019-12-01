import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';           

@Component({
  selector: 'app-saisie',
  templateUrl: './saisie.page.html',
  styleUrls: ['./saisie.page.scss'],
})
export class SaisiePage implements OnInit {
  qrScan:any;
  id_capteur : string = "";
  num_emplacement : string = "";
  saisieForm: FormGroup;
  regex: string = "^(?:@[a-zA-Z0-9][a-zA-Z0-9]*/)?[a-zA-Z0-9][a-zA-Z0-9]*$";

  constructor(
    private router: Router,
    private sqlite: SQLite,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog: Dialogs,
    public platform: Platform,
  ){        
    
      // Valide Formulaire
      this.saisieForm = this.formBuilder.group({
        id_capteur: new FormControl('', Validators.compose([
          Validators.pattern(this.regex),
          Validators.required
        ])) , 
        num_emplacement: new FormControl('', Validators.required) 
      });    

      //Désactive scanner quand le button "Retour" est pressé
      this.platform.backButton.subscribeWithPriority(0,()=>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubsribe();
      });

      // this.sqlite.create({
      //   name: 'data.db',
      //   location: 'default'
      // })
  }

  async saisieAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: '',
      message: 'This is an alert message.<ion-spinner name="bubbles"></ion-spinner>',
      buttons: ['OK']
    });

    await alert.present();
  }
  // Message d'erreurs
  validation_messages = {
    'id_capteur': [
      //{ type: 'required', message: 'Identifiant du capteur requis.' },
      //{ type: 'pattern', message: 'Le format doit être alphnumériques.' }
    ],
    'num_emplacement': [
      //{ type: 'required', message: 'Emplacement requis.' }
    ],
  };

  // Fonctions //saisie, startScanning, addPhoto, openLibrary, openCamera
  ngOnInit() {
  }

  saisie(values){
    console.log('Id Capteur         : ', this.saisieForm.value.id_capteur);
    console.log('Numéro Emplacement : ', this.saisieForm.value.num_emplacement);
    this.saisieAlert();
    this.router.navigate(["/home"]);
  }

  startScanning(){
    this.qr.prepare()
    
    .then((status:QRScannerStatus)=>{
      if(status.authorized)
      {
        //Autorisé
        this.qr.scan();
        this.qr.show( );
        document.getElementsByTagName("body")[0].style.opacity = "0";
        this.qrScan = this.qr.scan().subscribe(
            (textFound)=>
            {
              document.getElementsByTagName("body")[0].style.opacity = "1";
              //this.qrScan.unsubsribe();                                                       
              this.id_capteur = textFound ;
              this.saisieForm.value.id_capteur = textFound ;
              this.qrScan.hide(); //hide camera preview
              this.qrScan.unsubsribe();  
            },
            (err)=>{
              this.dialog.alert(JSON.stringify(err))
            })
      }
       else if(status.denied)
      {
        console.log("Accès Caméra refusé");
      }
       else{
        //Camera refusé mais peut demander l'accès plus tard
      }
    })
  }
}
