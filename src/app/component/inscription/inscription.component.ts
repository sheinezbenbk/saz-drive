
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: false,
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit {
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
      { value: 1, name: 'Janvier' },
      { value: 2, name: 'Février' },
      { value: 3, name: 'Mars' },
      { value: 4, name: 'Avril' },
      { value: 5, name: 'Mai' },
      { value: 6, name: 'Juin' },
      { value: 7, name: 'Juillet' },
      { value: 8, name: 'Août' },
      { value: 9, name: 'Septembre' },
      { value: 10, name: 'Octobre' },
      { value: 11, name: 'Novembre' },
      { value: 12, name: 'Décembre' }
  ];
  years: number[] = [];

  ngOnInit(): void {
      const currentYear = new Date().getFullYear();
      const startYear = 1900;
      this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  }


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
