import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  passwordVisible = false;
  mail: string = '';
  password: string = '';
  errorMessage: string = '';
  message: string = '';
  showLogoutAlert: boolean = false; // Nouvelle propriété pour l'alerte de déconnexion

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Vérifier si l'utilisateur vient de se déconnecter
    this.showLogoutAlert = this.authService.getLogoutMessage();
    
    if (this.showLogoutAlert) {
      // Effacer le message après l'avoir récupéré
      this.authService.clearLogoutMessage();
      
      // Masquer l'alerte après 5 secondes
      setTimeout(() => {
        this.showLogoutAlert = false;
      }, 5000);
    }
  }

  // Basculer la visibilité du mot de passe
  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(event: Event) {
    event.preventDefault();
  
    console.log('Tentative de connexion avec :', this.mail, this.password);
  
    this.apiService.login(this.mail, this.password).subscribe(
      (response) => {
        console.log('Réponse de l\'API :', response);
  
        // La réponse est déjà un objet JavaScript, pas besoin de parser
        if (response.message === 'Connexion réussie' && response.user) {
          console.log('Connexion réussie', response);
          this.message = 'Connexion réussie';
  
          // Stockez les informations de l'utilisateur dans localStorage
          localStorage.setItem('token', 'dummy-token');
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Rediriger vers différentes routes en fonction du rôle
          if (response.user.role === 'admin') {
            // Rediriger vers le dashboard admin
            this.router.navigate(['/app-admin']);
          } else {
            // Rediriger vers le dashboard standard
            this.router.navigate(['/app-dashboard']);
          }
        } else {
          console.error('Réponse inattendue de l\'API :', response);
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);
        this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      }
    );
  }
}