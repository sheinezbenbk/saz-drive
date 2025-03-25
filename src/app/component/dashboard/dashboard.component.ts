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
  examens: any[] = [];
  stats: any = {
    dernierExamen: null,
    moyenne: 0,
    pourcentage: 0,
    reussite: false
  };
  chartData: any[] = [];
  chartLabels: string[] = [];
  
  // Animation de confettis
  showConfetti: boolean = false;

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
          
          // Chargement des examens
          this.loadExamens();
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
  
  // Méthode pour charger les examens
  loadExamens() {
    if (!this.userData || !this.userData.id) {
      this.error = 'Données utilisateur incomplètes';
      this.loading = false;
      return;
    }
  
    this.apiService.getExamens(this.userData.id).subscribe({
      next: (data) => {
        this.examens = data.examens;
        this.stats = data.stats;
        
        // Préparer les données pour le graphique
        this.prepareChartData();
        
        // Afficher les confettis si l'élève a réussi
        if (this.stats.reussite) {
          console.log('Réussite détectée, lancement des confettis dans 1 seconde...');
          setTimeout(() => {
            this.createConfetti();
          }, 1000);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des examens:', error);
        this.error = 'Impossible de charger vos examens.';
        this.loading = false;
      }
    });
  }
  
  // Préparer les données pour le graphique
  prepareChartData() {
    if (this.examens.length === 0) return;
    
    // On inverse les examens pour les avoir dans l'ordre chronologique
    const reverseExamens = [...this.examens].reverse();
    
    this.chartLabels = reverseExamens.map(exam => exam.dateFormatee);
    this.chartData = reverseExamens.map(exam => exam.note);
    
    // Mettre à jour les graphiques
    this.initDonutCharts();
    this.updateChart();
  }

  // Méthode auxiliaire pour détruire les graphiques existants
  destroyCharts(canvasId: string) {
    const chartInstance = Chart.getChart(canvasId);
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  // Initialiser les graphiques donut
  initDonutCharts() {
    if (!this.stats || !this.stats.dernierExamen) return;
    
    // Détruire les graphiques existants s'il y en a
    this.destroyCharts('moyenneChart');
    this.destroyCharts('dernierExamenChart');
    
    // Graphique de moyenne
    const moyenneCanvas = document.getElementById('moyenneChart') as HTMLCanvasElement;
    if (moyenneCanvas) {
      const ctx = moyenneCanvas.getContext('2d');
      if (ctx) {
        // S'assurer que la toile est propre
        ctx.clearRect(0, 0, moyenneCanvas.width, moyenneCanvas.height);
        
        const moyenneChart = new Chart(moyenneCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Réussite', 'Reste'],
            datasets: [{
              data: [
                this.stats.pourcentage, 
                100 - this.stats.pourcentage
              ],
              backgroundColor: [
                '#63E189',  // Vert pour la partie réussie
                '#f5f5f5'   // Gris clair pour le reste
              ],
              borderColor: [
                '#63E189',
                '#f5f5f5'
              ],
              borderWidth: 1,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1000
            }
          }
        });
      }
    }
    
    // Graphique du dernier examen
    const dernierExamenCanvas = document.getElementById('dernierExamenChart') as HTMLCanvasElement;
    if (dernierExamenCanvas) {
      const ctx = dernierExamenCanvas.getContext('2d');
      if (ctx) {
        // S'assurer que la toile est propre
        ctx.clearRect(0, 0, dernierExamenCanvas.width, dernierExamenCanvas.height);
        
        const note = this.stats.dernierExamen.note;
        const pourcentage = (note / 40) * 100;
        
        const dernierExamenChart = new Chart(dernierExamenCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Note', 'Reste'],
            datasets: [{
              data: [
                pourcentage, 
                100 - pourcentage
              ],
              backgroundColor: [
                '#F3A0D5',  // Rose pour la partie obtenue
                '#f5f5f5'   // Gris clair pour le reste
              ],
              borderColor: [
                '#F3A0D5',
                '#f5f5f5'
              ],
              borderWidth: 1,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1000
            }
          }
        });
      }
    }
  }

  updateChart() {
    setTimeout(() => {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
      if (ctx) {
        // Détruire le graphique existant s'il y en a un
        this.destroyCharts('myChart');
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.chartLabels,
            datasets: [{
              label: 'Résultat sur 40',
              data: this.chartData,
              backgroundColor: '#F3A0D5',
              borderColor: 'black',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
    }, 100);
  }

  

  ngAfterViewInit() {
    // La méthode updateChart s'occupe maintenant de créer le graphique
  }

  getScorePercentage(note: number): number {
    return (note / 40) * 100;
}
createConfetti() {
  // Vérifier si l'animation doit être jouée
  if (!this.stats.reussite) return;
  
  console.log('Création des confettis...');

  // Créer un conteneur pour les confettis
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '9999';
  document.body.appendChild(confettiContainer);
  
  // Créer des éléments de confettis individuels
  const colors = ['#f2d74e', '#f25252', '#52c4f2', '#f292f2', '#7bf252'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    
    // Appliquer directement les styles au lieu d'utiliser une classe CSS
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = '0';
    confetti.style.top = '-10px';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.zIndex = '1000';
    
    // Ajouter l'animation directement en JavaScript
    confetti.style.animation = 'falldown 5s ease-out forwards';
    confetti.style.animationDelay = (Math.random() * 5) + 's';
    
    // Ajouter l'élément au conteneur
    confettiContainer.appendChild(confetti);
  }
  
  // Définir l'animation keyframes directement dans le DOM
  if (!document.getElementById('confetti-keyframes')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'confetti-keyframes';
    styleElement.textContent = `
      @keyframes falldown {
        0% {
          opacity: 1;
          top: -10px;
          transform: translateX(0) rotate(0deg);
        }
        100% {
          opacity: 0;
          top: 100vh;
          transform: translateX(100px) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  console.log('Confettis créés!');
  
  // Supprimer après l'animation
  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
      console.log('Animation de confettis terminée');
    }
  }, 10000);
}


}