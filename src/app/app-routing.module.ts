import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'nav', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'saisie', loadChildren: './saisie/saisie.module#SaisiePageModule' },
  { path: 'nav', loadChildren: './nav/nav.module#NavPageModule' },

 

   
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


          