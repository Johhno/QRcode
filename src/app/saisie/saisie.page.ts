import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file';

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
    private camera:Camera,
    private router:Router,
    private file:File,
    public navCtrl:NavController,
    public formBuilder:FormBuilder,
    public qr:QRScanner,
    public dialog:Dialogs,
    public platform:Platform,
  ){
      //Désactive scanner quand le button "Retour" est pressé
      this.platform.backButton.subscribeWithPriority(0,()=>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubsribe();
      });

      // Valide Formulaire
      this.saisieForm = this.formBuilder.group({
        id_capteur: new FormControl('', Validators.compose([
          //Validators.pattern('^(^(?:@[a-zA-Z0-9-~][a-zA-A0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$'),
          Validators.required
        ])) , 
        num_emplacement: new FormControl('', Validators.required) 
      });
  }
 
  // Message d'erreurs
  validation_messages = {
    'id_capteur': [
      //{ type: 'required', message: 'ID Capteur requis.' },
      { type: 'pattern', message: 'ID Capteur doit être alphnumériques.' }
    ],
    'num_emplacement': [
      { type: 'required', message: 'Emplacement requis.' }
    ],
  };
  // Fonctions
  startScanning(){
    this.qr.prepare().then((status:QRScannerStatus)=>{
      if(status.authorized)
      {
        var callback = function(err, contents){
          if(err){
            console.error(err._message);
          }
          alert('The QR Code contains: ' + contents);
        };
        //Autorisé
        this.qr.scan();
        this.qr.show( );
        document.getElementsByTagName("body")[0].style.opacity = "0";
        this.qrScan = this.qr.scan().subscribe(
            (textFound)=>
            {
              // document.getElementsByTagName("body")[0].style.opacity = "1";
              // this.qrScan.unsubsribe();                                                       
              // this.dialog.alert(textFound); 
              textFound = this.saisieForm.value.id_capteur;
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

  ngOnInit() {
  }

  saisie(values){
    console.log('Id Capteur: ', this.saisieForm.value.id_capteur);
    console.log('Numéro Emplacement: ', this.saisieForm.value.num_emplacement);
    this.router.navigate(["/home"]);
    //var file = new File(["foo"], "foo.txt", {
    //  type: "text/plain",
    //});
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
