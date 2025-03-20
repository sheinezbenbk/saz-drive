import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,  
  imports: [CommonModule], 
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  passwordVisible = false; // Gestion de la visibilité du mot de passe
  alerteVisible = false; // L'alerte est cachée au départ

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  afficherAlerte(event: Event) {
    event.preventDefault(); // Empêche le rechargement de la page
    this.alerteVisible = true; // Affiche l'alerte
  }
}
