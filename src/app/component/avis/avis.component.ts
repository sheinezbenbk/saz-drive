import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-avis',
  standalone: false,
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent implements OnInit {

  listeAvis: any[] = [];
  message: string = '';
  isError: boolean = false;
  isSuccess: boolean = false;
  ngOnInit(): void {
    this.chargerAvis();
  }

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private authService: AuthService
  ) {}

  
  chargerAvis() {
    this.apiService.getAvis().subscribe({
      next: (data) => {
        this.listeAvis = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.afficherMessage('Erreur lors du chargement des avis', true);
      }
    });
  }

  supprimerAvis(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis?')) {
      this.apiService.supprimerAvis(id).subscribe({
        next: (reponse) => {
          this.afficherMessage('Avis supprimé avec succès', false);
          this.chargerAvis(); // Recharger la liste des avis
        },
        error: (erreur) => {
          console.error('Erreur lors de la suppression:', erreur);
          this.afficherMessage('Erreur lors de la suppression', true);
        }
      });
    }
  }

  afficherMessage(msg: string, estErreur: boolean) {
    this.message = msg;
    this.isError = estErreur;
    this.isSuccess = !estErreur;
    
    setTimeout(() => {
      this.message = '';
      this.isError = false;
      this.isSuccess = false;
    }, 3000);
  }



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
