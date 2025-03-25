// dashboardadmin.component.ts
import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboardadmin',
  standalone : true, 
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})
export class DashboardadminComponent implements OnInit, AfterViewInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  
  userData: any = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    datedenaissance: '',
    ville: '',
    code_neph: '',
    statut: '',
    examens: []
  };
  
  loading: boolean = true;
  error: string = '';



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getUserData(id);
      } else {
        this.error = "ID de l'élève non spécifié";
        this.loading = false;
      }
    });
  }
  
  getUserData(id: string): void {
    this.loading = true;
    this.apiService.getEleveById(id).subscribe({
      next: (data) => {
        this.userData = data;
        this.loading = false;
        console.log('Données de l\'élève chargées:', this.userData);
        // Initialiser le graphique après le chargement des données
        setTimeout(() => this.initChart(), 0);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.error = "Impossible de charger les données de l'élève";
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    // Attendez que les données soient chargées avant d'initialiser le graphique
    setTimeout(() => {
      this.initChart();
    }, 500);
  }

  initChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
    
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.userData.examens?.map((exam: any) => exam.date) || 
                 ['10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03', '10/03'],
          datasets: [{
            label: 'Résultat sur 40',
            data: this.userData.examens?.map((exam: any) => exam.note) || 
                  [15, 10, 32, 35, 28, 40, 10, 32, 35, 28],
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
              grid: { display: false },
              ticks: { color: 'black' }
            },
            x: {
              grid: { display: false },
              ticks: { color: 'black' }
            }
          }
        }
      });
    } else {
      console.error('Canvas #myChart non trouvé !');
    }
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