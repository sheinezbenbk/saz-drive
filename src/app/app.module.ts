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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AccueilComponent,
    ConnexionComponent,
    CandidatComponent,
    AdminComponent,
    AutoecoleComponent,
    AproposComponent,
    EntrainementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
