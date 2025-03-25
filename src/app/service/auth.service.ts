// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost/sazdrive';
    private logoutMessage: boolean = false;
    
    // BehaviorSubject pour gérer l'état de connexion
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
    
    
    constructor(private http: HttpClient) { }

    // Méthode pour vérifier l'état de connexion initial
    private checkLoginStatus(): boolean {
        return !!localStorage.getItem('user') || !!localStorage.getItem('admin');
    }
    
    // Observable pour s'abonner aux changements d'état
    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }
    
    // Getter pour obtenir l'état actuel
    get authenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
    
    // Méthode pour mettre à jour l'état après connexion
    updateAuthState(isLoggedIn: boolean): void {
        this.isAuthenticatedSubject.next(isLoggedIn);
    }
    
    // Méthode de déconnexion
    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        this.isAuthenticatedSubject.next(false);
        this.setLogoutMessage(true);
    }
    
    // Méthodes existantes inchangées
    setLogoutMessage(value: boolean) {
        this.logoutMessage = value;
    }

    getLogoutMessage() {
        return this.logoutMessage;
    }

    clearLogoutMessage() {
        this.logoutMessage = false;
    }
}