import { Component, OnInit } from '@angular/core';
import { SaisiePage } from '../saisie/saisie.page';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.page.html',
  styleUrls: ['./nav.page.scss'],
})
export class NavPage implements OnInit {

  constructor() { }
  nav = document.querySelector('ion-nav');
  ngOnInit() {
  }

  navigateForward() {
    console.log(this.nav.push('saisie'));
    //this.nav.push('saisie');
  }
}
