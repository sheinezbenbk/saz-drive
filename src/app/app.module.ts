import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { CandidatComponent } from './component/candidat/candidat.component';
import { AdminComponent } from './component/admin/admin.component';
import { AutoecoleComponent } from './component/autoecole/autoecole.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { EntrainementComponent } from './component/entrainement/entrainement.component';
import { InscriptionComponent } from './component/inscription/inscription.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DashboardadminComponent } from './component/dashboardadmin/dashboardadmin.component';
import { ModifierComponent } from './component/modifier/modifier.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AvisComponent } from './component/avis/avis.component';
import { PageavisComponent } from './component/pageavis/pageavis.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AccueilComponent,
    CandidatComponent,
    AdminComponent,
    AutoecoleComponent,
    AproposComponent,
    EntrainementComponent,
    InscriptionComponent,
    DashboardComponent,
    DashboardadminComponent,
    AvisComponent,
    PageavisComponent,
    
  ],
  imports: [
    ConnexionComponent,
    ModifierComponent,
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
