import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sazdrive';

  //cacher le header pour certaines pages
  hideHeader: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenPrefixes = [
          '/app-dashboardadmin', 
          '/app-admin', 
          '/app-modifier', 
          '/app-inscription', 
          '/app-avis', 
          
        ]; 
        this.hideHeader = hiddenPrefixes.some(prefix => event.url.startsWith(prefix));
      }
    });
  }
}