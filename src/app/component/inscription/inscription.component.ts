import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: false,
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit {
  inscriptionForm: FormGroup;
  message: string = '';
  error: string = '';
  loading: boolean = false;
  showAlert: boolean = false;
  
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
      { value: 1, name: 'Janvier' },
      { value: 2, name: 'Février' },
      { value: 3, name: 'Mars' },
      { value: 4, name: 'Avril' },
      { value: 5, name: 'Mai' },
      { value: 6, name: 'Juin' },
      { value: 7, name: 'Juillet' },
      { value: 8, name: 'Août' },
      { value: 9, name: 'Septembre' },
      { value: 10, name: 'Octobre' },
      { value: 11, name: 'Novembre' },
      { value: 12, name: 'Décembre' }
  ];
  years: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService, 
    private router: Router,
    private authService: AuthService
  ) {
    this.inscriptionForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      jour: ['', [Validators.required]],
      mois: ['', [Validators.required]],
      annee: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9 ]{10,14}$/)]],
      ville: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      code_neph: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Empêche le formulaire de rafraîchir la page
    
    if (this.inscriptionForm.invalid) {
      this.error = 'Veuillez remplir correctement tous les champs du formulaire.';
      this.showAlert = true;
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';
    this.showAlert = false;

    // Formatage de la date de naissance pour MySQL (YYYY-MM-DD)
    const jour = this.inscriptionForm.value.jour.toString().padStart(2, '0');
    const mois = this.inscriptionForm.value.mois.toString().padStart(2, '0');
    const annee = this.inscriptionForm.value.annee;
    const dateNaissance = `${annee}-${mois}-${jour}`;

    // Préparation des données à envoyer
    const nouvelUtilisateur = {
      nom: this.inscriptionForm.value.nom,
      prenom: this.inscriptionForm.value.prenom,
      email: this.inscriptionForm.value.email,
      mot_de_passe: this.inscriptionForm.value.mot_de_passe,
      role: 'eleve',
      telephone: this.inscriptionForm.value.telephone,
      ville: this.inscriptionForm.value.ville,
      code_neph: this.inscriptionForm.value.code_neph,
      datedenaissance: dateNaissance
    };

    console.log('Données à envoyer:', nouvelUtilisateur); // Ajout de log pour déboguer

    this.apiService.ajouterEleve(nouvelUtilisateur).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response); // Ajout de log pour déboguer
        this.loading = false;
        this.message = 'Nouvel élève ajouté avec succès!';
        this.showAlert = true;
        this.inscriptionForm.reset();
        
        // Réinitialiser les valeurs par défaut pour les sélecteurs
        this.inscriptionForm.patchValue({
          jour: '',
          mois: '',
          annee: ''
        });
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'élève:', error);
        this.loading = false;
        this.error = `Erreur lors de l'ajout: ${error.message || 'Veuillez réessayer.'}`;
        this.showAlert = true;
      }
    });
  }
  
  logout() {
    this.apiService.logout().subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.authService.setLogoutMessage(true);
        this.router.navigate(['/app-connexion']); // Redirection vers la page de connexion
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }
}