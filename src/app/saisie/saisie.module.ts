import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SaisiePage } from './saisie.page';

const routes: Routes = [
  {
    path: '',
    component: SaisiePage
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
    Dialogs
  ],
  declarations: [SaisiePage]
})
export class SaisiePageModule {}
