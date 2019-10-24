import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  signinForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder
    ) {
      this.signinForm = this.formBuilder.group({
        nom: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required)   
      });
   }

   validation_messages = {
    'nom': [
      { type: 'required', message: 'Nom requis.' }
    ],
    'prenom': [
      { type: 'required', message: 'Prénom requis.' }
    ],
  };

  onSubmit(values){
    console.log('Nom', this.signinForm.value.nom);
    console.log('Prenom', this.signinForm.value.prenom);
  }
   ngOnInit() {
  }

  signin(){
    //console.log('Nom', this.signinForm.value.nom);
    //console.log('Prenom', this.signinForm.value.prenom);
  }
}
