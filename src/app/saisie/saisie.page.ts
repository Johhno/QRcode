import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';

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
  image: string;

  constructor(
    public navCtrl:NavController,
    public formBuilder:FormBuilder,
    public qr:QRScanner,
    public dialog:Dialogs,
    public platform:Platform,
    private camera:Camera,
    private router:Router
    ) {
      //Désactive scanner quand le button "Retour" est pressé
      this.platform.backButton.subscribeWithPriority(0,()=>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubsribe();
      })

      // Valide Formulaire
      this.saisieForm = this.formBuilder.group({
        id_capteur: new FormControl('', Validators.compose([
          //Validators.maxLength(12),
          //Validators.minLength(5),
          Validators.pattern('^(?=.*[a-zA-Z])+[a-zA-Z0-9]$'),
          //Validators.required
        ])) , 
        num_emplacement: new FormControl('', Validators.required) 
      });
  }

  // Fonctions
  startScanning(){
    this.qr.prepare().then((status:QRScannerStatus)=>{
      if(status.authorized)
      {
        //Autorisé
        this.qr.scan();
        this.qr.show( );
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

   // Message d'erreurs
  validation_messages = {
    'id_capteur': [
      //{ type: 'maxlength', message: 'ID Capteur pas plus de 1 caractère.' },
      //{ type: 'required', message: 'ID Capteur requis.' },
      { type: 'pattern', message: 'ID Capteur doit être alphnumériques.' }
    ],
    'num_emplacement': [
      { type: 'required', message: 'Emplacement requis.' }
    ],
  };

  // Fonctions
  ngOnInit() {
  }

  saisie(values){
    console.log('Id Capteur: ', this.saisieForm.value.id_capteur);
    console.log('Numéro Emplacement: ', this.saisieForm.value.num_emplacement);
    this.router.navigate(["/home"]);
  }

  // Choix Bibliothèque - Capture
  async addPhoto(source: string) {
    if (source === 'library'){
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = 'data:image/jpg;base64,' + libraryImage;
    }
    else{
      console.log('camera');
      const cameraImage = await this.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
 }

  // Ouvre THE Bibliothèque
  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }

}
