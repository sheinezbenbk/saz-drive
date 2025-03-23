import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-avis',
  standalone: false,
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent {

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private authService: AuthService
  ) {}

  logout() {
    this.apiService.logout().subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.authService.setLogoutMessage(true);
        this.router.navigate(['/app-connexion']); // Redirection vers la page de connexion
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }

}
