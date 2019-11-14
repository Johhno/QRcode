import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  // Variables
  qrScan:any;
  id_capteur : string = "";
  num_emplacement : string = "";
  signinForm: FormGroup;
  image: string;
  // Constructeur
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public qr: QRScanner,
    public dialog:Dialogs,
    public platform:Platform,
    private camera:Camera
    ) {
      //Désactive scanner quand le button "Retour" est pressé
      this.platform.backButton.subscribeWithPriority(0,()=>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubsribe();
      })

      // Valide Formulaire
      this.signinForm = this.formBuilder.group({
        id_capteur: new FormControl('', Validators.required),
        num_emplacement: new FormControl('', Validators.required)   
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
    'id_capteur': [
      { type: 'required', message: 'ID Capteur requis.' }
    ],
    'num_emplacement': [
      { type: 'required', message: 'Emplacement requis.' }
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
    console.log('Id Capteur: ', this.signinForm.value.id_capteur);
    console.log('Numéro Emplacement: ', this.signinForm.value.num_emplacement);
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
