import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements AfterViewInit {

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
