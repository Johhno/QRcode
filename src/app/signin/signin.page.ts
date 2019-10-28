import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  // Variables
  qrScan:any;
  nom_client : string = "";
  prenom_client : string = "";
  signinForm: FormGroup;

  // Constructeur
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog:Dialogs,
    public platform:Platform
    ) {
      //Désactive scanner quand le button Retour est pressé
      this.platform.backButton.subscribeWithPriority(0,()=>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubsribe();
      })

      // Valide Formulaire
      this.signinForm = this.formBuilder.group({
        nom: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required)   
      });
  }


  // Fonctions
  StartScanning(){
    this.qr.prepare().then((status:QRScannerStatus)=>{
      if(status.authorized)
      {
        //Camera autorisé
        this.qr.scan();
        this.qr.show();
          document.getElementsByTagName("body")[0].style.opacity = "0";
          this.qrScan = this.qr.scan().subscribe((textFound)=>{
            document.getElementsByTagName("body")[0].style.opacity = "1";
            this.qrScan.unsubsribe();                                                       //
            this.dialog.alert(textFound);
          },(err)=>{
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

   // Message d'errerus
  validation_messages = {
    'nom': [
      { type: 'required', message: 'Nom requis.' }
    ],
    'prenom': [
      { type: 'required', message: 'Prénom requis.' }
    ],
  };

  // Fonctions
  onSubmit(values){
    //console.log('Nom', this.signinForm.value.nom);
    //console.log('Prenom', this.signinForm.value.prenom);
  }
   ngOnInit() {

  /*   this.http.get('http://localhost:3000/posts').map(res => res.json()).subscribe(data => {
      console.log(data);
    }); */
  }

  signin(){
    console.log('Nom: ', this.signinForm.value.nom);
    console.log('Prenom: ', this.signinForm.value.prenom);
  }
}
