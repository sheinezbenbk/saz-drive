import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './component/accueil/accueil.component';
import { AdminComponent } from './component/admin/admin.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { AutoecoleComponent } from './component/autoecole/autoecole.component';
import { CandidatComponent } from './component/candidat/candidat.component';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { EntrainementComponent } from './component/entrainement/entrainement.component';
import { InscriptionComponent } from './component/inscription/inscription.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DashboardadminComponent } from './component/dashboardadmin/dashboardadmin.component';
import { ModifierComponent } from './component/modifier/modifier.component';
import { AvisComponent } from './component/avis/avis.component';
import { PageavisComponent } from './component/pageavis/pageavis.component';

const routes: Routes = [
  {path: 'app-accueil', component: AccueilComponent},
  {path: 'app-admin', component: AdminComponent}, 
  {path: 'app-apropos', component: AproposComponent}, 
  {path: 'app-autoecole', component: AutoecoleComponent}, 
  {path: 'app-candidat', component: CandidatComponent}, 
  {path: 'app-connexion', component: ConnexionComponent}, 
  {path: 'app-entrainement', component: EntrainementComponent}, 
  {path: 'app-inscription', component: InscriptionComponent}, 
  {path:'app-dashboard', component:DashboardComponent}, 
  {path:'app-dashboardadmin', component:DashboardadminComponent}, 
  {path:'app-modifier', component:ModifierComponent}, 
  {path:'app-avis', component:AvisComponent}, 
  {path:'app-pageavis', component:PageavisComponent}, 
  {path: '', component: AccueilComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
