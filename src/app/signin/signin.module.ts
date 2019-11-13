import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicModule } from '@ionic/angular';

import { SigninPage } from './signin.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

const routes: Routes = [
  {
    path: '',
    component: SigninPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    QRScanner,
    Camera,
    Dialogs
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {}
