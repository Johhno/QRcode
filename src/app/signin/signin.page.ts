import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  // Variables
 
  login : string = "";
  password : string = "";
  signinForm: FormGroup;
  // Constructeur
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public dialog:Dialogs,
    public platform:Platform,
    private router: Router
    ) {
      
      
      // Valide Formulaire
      this.signinForm = this.formBuilder.group({
        login: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)   
      });
  }

  // Fonctions

   // Message d'errerus
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
  /*   this.http.get('http://localhost:3000/posts').map(res => res.json()).subscribe(data => {
      console.log(data);
    }); */
  }
 
  signin(values){
    console.log('Login: ', this.signinForm.value.login);
    console.log('Password: ', this.signinForm.value.password);
    this.router.navigate(["/saisie"]);
  }
}
