import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Eleve } from '../model/eleve.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/sazdrive'; // URL de votre backend

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Configuration des headers HTTP pour les requêtes
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Méthode pour récupérer la liste des élèves depuis l'API
  getEleves(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${this.apiUrl}/eleve.php`)
      .pipe(
        tap(data => console.log('Élèves récupérés:', data)),
        catchError(this.handleError)
      );
  }

  getEleveById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/eleve.php?id=${id}`, { responseType: 'text' })
      .pipe(
        map(response => {
          console.log('Réponse brute du serveur:', response);
          try {
            // Essayer de parser la réponse en JSON
            return JSON.parse(response);
          } catch (e) {
            console.error('Erreur de parsing JSON:', e);
            console.log('Contenu de la réponse qui a causé l\'erreur:', response);
            throw new Error('Réponse non-JSON reçue du serveur');
          }
        }),
        tap(data => console.log(`Élève ID=${id} récupéré:`, data)),
        catchError(err => {
          console.error('Erreur complète:', err);
          return throwError(() => new Error('Impossible de charger les informations de l\'élève'));
        })
      );
  }

  // Méthode pour ajouter un nouvel élève
  ajouterEleve(eleve: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter.php`, eleve, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Élève ajouté:', data)),
        catchError(this.handleError)
      );
  }
  
  // Méthode pour mettre à jour un élève
  updateEleve(eleve: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update.php`, eleve, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Élève mis à jour:', data)),
        catchError(this.handleError)
      );
  }
  
  // Méthode pour supprimer un élève - mise à jour pour utiliser delete_eleve.php
  deleteEleve(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_eleve.php`, { id }, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log(`Élève ID=${id} supprimé:`, data)),
        catchError(this.handleError)
      );
  }
    
// Méthode pour se connecter
login(email: string, password: string): Observable<any> {
  interface LoginResponse {
    message: string;
    user: any;
  }

  const body = { email, mot_de_passe: password };
  return this.http.post<any>(`${this.apiUrl}/login.php`, body, { 
    headers: this.getHeaders(),
    responseType: 'json'
  }).pipe(
    tap(response => {
      console.log('Connexion réussie:', response);
      
      try {
        // Vérifier si la réponse a la structure attendue en toute sécurité
        if (response && 
            Object.prototype.hasOwnProperty.call(response, 'message') && 
            Object.prototype.hasOwnProperty.call(response, 'user') &&
            response.message === "Connexion réussie") {
          
          // TypeScript devrait maintenant reconnaître ces propriétés
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Mettre à jour l'état d'authentification
          this.authService.updateAuthState(true);
        }
      } catch (error) {
        console.error('Erreur lors du traitement de la connexion:', error);
      }
    }),
    catchError(this.handleError)
  );
}

  // Méthode de déconnexion
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout.php`, {}, {
      headers: this.getHeaders(),
      withCredentials: true // Important pour les cookies de session
    }).pipe(
      tap(data => console.log('Déconnexion réussie:', data)),
      catchError(this.handleError)
    );
  }
  
  // Récupérer les détails d'un utilisateur
  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-details.php?id=${userId}`)
      .pipe(
        tap(data => console.log(`Détails utilisateur ID=${userId} récupérés:`, data)),
        catchError(this.handleError)
      );
  }

  // Récupérer tous les avis
  getAvis(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/avis.php`)
      .pipe(
        tap(data => console.log('Avis récupérés:', data)),
        catchError(this.handleError)
      );
  }
  
  // Ajouter un nouvel avis
  ajouterAvis(avis: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/avis.php`, avis, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Avis ajouté:', data)),
        catchError(this.handleError)
      );
  }
  
  // Supprimer un avis
  supprimerAvis(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete.php?id=${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log(`Avis ID=${id} supprimé:`, data)),
        catchError(this.handleError)
      );
  }

  // Gestionnaire d'erreurs global
  private handleError(error: any) {
    console.error('Une erreur est survenue', error);
    let errorMessage = 'Erreur serveur';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else if (error.status) {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getExamens(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/examens.php?id=${userId}`)
      .pipe(
        tap(data => console.log('Examens récupérés:', data)),
        catchError(this.handleError)
      );
  }

}