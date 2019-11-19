import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { Platform } from '@ionic/angular';
import {Dialogs} from '@ionic-native/dialogs/ngx';
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

  constructor(
    public formBuilder:FormBuilder,
    public dialog:Dialogs,
    public platform:Platform,
    private router:Router
    ) {
      
      // Valide Formulaire
      this.signinForm = this.formBuilder.group({
        login: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)   
      });
  }

   // Message d'erreurs
  validation_messages = {
    'login': [
      { type: 'required', message: 'Login requis.' }
    ],
    'password': [
      { type: 'required', message: 'Password requis.' }
    ],
  };

  // Fonctions
  ngOnInit() {

  }
  signin(values){
    console.log('Login: ', this.signinForm.value.login);
    console.log('Password: ', this.signinForm.value.password);
    this.router.navigate(["/saisie"]);
  }
}
