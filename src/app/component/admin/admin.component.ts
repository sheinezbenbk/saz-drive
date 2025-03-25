import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Eleve } from '../../model/eleve.model';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  eleves: Eleve[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.chargerEleves();
  }

  chargerEleves(): void {
    this.loading = true;
    this.apiService.getEleves().subscribe({
      next: (data) => {
        this.eleves = data;
        this.loading = false;
        console.log('Élèves chargés:', this.eleves); // Correction ici
      },
      error: (error) => {
        console.error('Erreur lors du chargement des élèves', error);
        this.error = 'Impossible de charger la liste des élèves';
        this.loading = false;
      }
    });
  }

  // Méthode pour déterminer la classe CSS en fonction du statut de l'élève
  getStatusClass(statut: string): string {
    return statut === 'ADMIS' ? 'status delivered' : 'status cancelled';
  }

  logout() {
    this.apiService.logout().subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.authService.setLogoutMessage(true);
        this.router.navigate(['/app-connexion']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }

}