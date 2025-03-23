import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements AfterViewInit, OnInit {
  // Propriétés pour stocker les infos de l'élève
  userData: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const userDataStr = localStorage.getItem('user');
    
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
      console.log('Données de base:', this.userData);
      
      // Récupérer les détails complets
      this.apiService.getUserDetails(this.userData.id).subscribe({
        next: (data) => {
          // Fusionner les données utilisateur et candidat
          this.userData = {
            ...this.userData,
            ...data.user,
            ...data.candidat
          };
          console.log('Données complètes:', this.userData);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des détails:', error);
          this.error = 'Impossible de charger tous vos détails.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Vous n\'êtes pas connecté.';
      this.loading = false;
      this.router.navigate(['/app-connexion']);
    }
  }
  
  // Méthode pour charger des détails supplémentaires si nécessaire
  loadUserDetails() {
    if (!this.userData || !this.userData.id) {
      this.error = 'Données utilisateur incomplètes';
      this.loading = false;
      return;
    }

    // Vous pourriez avoir besoin d'appeler une API pour obtenir plus de détails
    // this.apiService.getUserDetails(this.userData.id).subscribe({
    //   next: (data) => {
    //     this.userData = {...this.userData, ...data};
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du chargement des détails:', error);
    //     this.error = 'Impossible de charger tous vos détails.';
    //     this.loading = false;
    //   }
    // });
    
    // Si vous n'avez pas besoin d'appeler l'API, marquez simplement comme chargé
    this.loading = false;
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03'],
          datasets: [{
            label: 'Résultat sur 40',
            data: [15, 10, 32, 35, 28, 40, 10, 32, 35, 28],
            backgroundColor: '#F3A0D5',
            borderColor: 'black',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              position: 'right',
              grid: {
                display: false
              },
              ticks: {
                color: 'black'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'black'
              }
            }
          }
        }
      });
    } else {
      console.error('Canvas #myChart non trouvé !');
    }
  }
}