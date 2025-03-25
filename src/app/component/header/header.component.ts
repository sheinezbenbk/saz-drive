import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false, 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authSubscription!: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
        console.log('État de connexion:', this.isLoggedIn);
      }
    );
    
    // Vérifier l'état initial
    this.isLoggedIn = this.authService.authenticated;
  }
  
  logout(): void {
    console.log('Déconnexion demandée');
    this.authService.logout();
    this.router.navigate(['/app-connexion']);
  }
  
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}