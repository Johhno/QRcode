import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform , AlertController,ToastController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

interface UserList {
  login: string;
  password: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  login : string;
  password : string;
  authenticated:any;
  signinForm: FormGroup;
  messagesDeValidation: any;
  userList: [];
  //userList: UserList[];
  constructor(
    public formBuilder: FormBuilder,
    public dialog: Dialogs, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private storage: Storage,
    private router: Router
  ) {
    this.initForm();
    this.initValidationMessages();
    this.initUserList();
    
    // vérifie sir le user est authentifié
      this.getAuthentificationStatus().then(
          (data) => {
              console.log('data localstorage is ',data);
              if(data == 1){
                  this.router.navigate(["/saisie"]);
              }
          }
      );
  }

  private async initUserList(): Promise<void> {
    console.log("dans ini user list");
    this.userList = [];

    // on crée le user à la mano on met dans le storage
    //this.userList.push({login:'john',password:'123'});
    //this.saveUserList(this.userList);
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
    console.log('Login    : ', this.login);
    console.log('Password : ', this.password);

    let login = this.login;
    let password = this.password

    if(login == 'john' && password == '123' ){
      this.signinAlert();

      //met le user dans le tableau
      //this.userList.push({login:login, password:password})
      //stocker dans le local storage userList
      this.saveUserList(this.userList).then(
        (data) => {this.router.navigate(["/saisie"]);},
        (error) => console.log(error)
      )
      this.saveUserList(this.userList);

      //set authenticated to 1 in local storage

      this.setAuthenticated(1);
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

  private async getUserList(): Promise<void> {
    // si userList dans le storage n'exist pas => return []
    console.log('lit user dans storage')
    let user_list = await this.storage.get('userList');

    return user_list || []
  }

  private async saveUserList(userList: any): Promise<void> {
    await this.storage.set('userList', userList);
  }

  private async setAuthenticated(authStatus:any){
    await this.storage.set('authenticated', 1);
  }

  private getAuthentificationStatus(){
    return this.storage.get('authenticated');//promise
  }

  ngOnInit() {
  }
 
}
