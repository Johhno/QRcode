import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform , AlertController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  login : string = "";
  password : string = "";
  signinForm: FormGroup;
  messagesDeValidation: any;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: Dialogs,
    public alertCtrl: AlertController,
    public platform: Platform,
    private router: Router
  ) {
    this.initForm();
    this.initValidationMessages();
  }

  private initForm(): void {
    this.signinForm = this.formBuilder.group({
      login: ['', this.loginValidators()], 
      password: ['', Validators.required]
    });
  }

  /**
   * @returns validators for the login field.
   */ 
  private loginValidators(): any {
    return Validators.compose([,
      Validators.pattern("^(?:@[a-zA-Z-~][a-zA-Z-._~]*/)?[a-zA-Z-~][a-zA-Z-._~]*$"),
      Validators.required
    ]);
  }

  /**
   * Initialize every validation messages of the form.
   */

  private initValidationMessages(): void {
    this.messagesDeValidation = {
      'login': [
        //{ type: 'required', message: 'Identifiant du capteur requis.' },
        //{ type: 'pattern', message: 'Le format doit être alphnumériques.' }
      ],
      'password': [
        //{ type: 'required', message: 'Emplacement requis.' }
      ]
    };
  }
  
  ngOnInit() {
  }

  signin(values){
    console.log('Login    : ', this.signinForm.value.login);
    console.log('Password : ', this.signinForm.value.password);
    this.signinAlert();
    this.router.navigate(["/saisie"]);
  }
  
  async signinAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Connexion',
      message: "Login : " +this.signinForm.value.login+
      "<br/>Password : "+this.signinForm.value.password,
      buttons: ['OK']
    });

    await alert.present();
  }
}
