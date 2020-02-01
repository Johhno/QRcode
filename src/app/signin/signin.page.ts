import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform , AlertController,ToastController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';

interface UserRecord {
  pseudo: string;
  mdp: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  login : string;
  password : string;
  signinForm: FormGroup;
  messagesDeValidation: any;
  userList: UserRecord[];

  constructor(
    public formBuilder: FormBuilder,
    public dialog: Dialogs, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private router: Router
  ) {
    this.initForm();
    this.initValidationMessages();
  }

  private async initUserList(): Promise<void> {
    this.userList = [];
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

  signin(values){
    console.log('Login    : ', this.signinForm.value.login);
    console.log('Password : ', this.signinForm.value.password);

    if(this.signinForm.value.login == 'john' && this.signinForm.value.password == '123' ){

        this.signinAlert();

        this.router.navigate(["/saisie"]);

    } else {
        this.signinError();
    }
  }
  
  async signinAlert() {
        const toast = await this.toastCtrl.create({
            header: 'Bienvenue ' +this.login,
            buttons: ['OK']
        });

        await toast.present();
    }

    async signinError() {
        const toast = await this.toastCtrl.create({
            header: 'Error login',
            buttons: ['Réessayer']
        });

        await toast.present();
    }

  ngOnInit() {
  }
 
}
