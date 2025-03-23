import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../model/eleve.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/sazdrive'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des élèves depuis l'API
  getEleves(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${this.apiUrl}/eleves.php`);
  }

  // Méthode pour récupérer les détails d'un élève par son ID
  getEleveById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eleve.php?id=${id}`);
  }

    // Méthode pour ajouter un nouvel élève
    ajouterEleve(eleve: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/ajouter.php`, eleve);
    }
    

  // Méthode pour se connecter
  login(email: string, password: string): Observable<any> {
    const body = { email, mot_de_passe: password };
    return this.http.post(`${this.apiUrl}/login.php`, body, { responseType: 'json' });
  }

  // Méthode de déconnexion
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout.php`, {}, {
      withCredentials: true // Important pour les cookies de session
    });
  }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-details.php?id=${userId}`);
  }
}