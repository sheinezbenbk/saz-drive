import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../model/eleve.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost/sazdrive';
    private logoutMessage: boolean = false;
    constructor(private http: HttpClient) { }

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