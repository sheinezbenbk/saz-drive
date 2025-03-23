import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../model/eleve.model';
import {  of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/sazdrive'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  // Méthode temporaire avec données fictives
  getEleves(): Observable<Eleve[]> {
    console.log('Génération de données fictives');
    
    const elevesTest = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', statut: 'ADMIS', email: 'jean@example.com', telephone: '0123456789', datedenaissance: '15/05/1995', ville: 'Paris', code_neph: '123456789' },
      { id: 2, nom: 'Martin', prenom: 'Sophie', statut: 'EN COURS', email: 'sophie@example.com', telephone: '0123456780', datedenaissance: '22/09/1998', ville: 'Lyon', code_neph: '987654321' },
      { id: 3, nom: 'Vigneswaran', prenom: 'Abi', statut: 'ADMIS', email: 'vigneswaranabi@gmail.com', telephone: '0945752190', datedenaissance: '09/03/2005', ville: 'Chelles', code_neph: '1534577778.6667' }
    ];
    
    return of (elevesTest);
  }

  getEleveById(id: string): Observable<any> {
    console.log('Génération de données fictives pour l\'élève:', id);
    
    const eleveTest = {
      id: parseInt(id),
      nom: 'Vigneswaran',
      prenom: 'Abi',
      statut: 'ADMIS',
      email: 'vigneswaranabi@gmail.com',
      telephone: '0945752190',
      datedenaissance: '09/03/2005',
      ville: 'Chelles',
      code_neph: '1534577778.6667',
      examens: [
        { date: 'Lun, 10 Mars', heure: '8:35', nom: 'EXAMEN BLANC CODE DE LA ROUTE', note: 35 },
        { date: 'Mar, 15 Mars', heure: '9:15', nom: 'EXAMEN BLANC CODE DE LA ROUTE', note: 37 },
        { date: 'Jeu, 20 Mars', heure: '10:45', nom: 'EXAMEN BLANC CODE DE LA ROUTE', note: 38 },
      ],
      dernierExamen: {
        note: 38,
        pourcentage: 95
      }
    };
    
    return of(eleveTest);
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

  // Nouvelle méthode pour récupérer les élèves
  // getEleves(): Observable<Eleve[]> {
  //   return this.http.get<Eleve[]>(`${this.apiUrl}/eleves.php`);
  // }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-details.php?id=${userId}`);
  }

 // Méthode pour récupérer les données d'un élève par son ID
//  getEleveById(id: string): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}/eleves/${id}`);
// }
}