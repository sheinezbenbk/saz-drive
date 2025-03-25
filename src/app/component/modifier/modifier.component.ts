import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-modifier',
  standalone: false, 
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.css'],

})
export class ModifierComponent implements OnInit {
  eleveForm: FormGroup;
  eleveId: string | null = null;
  loading: boolean = true;
  error: string = '';
  message: string = '';
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Initialiser le formulaire avec des valeurs vides
    this.eleveForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: this.fb.group({
        jour: ['', Validators.required],
        mois: ['', Validators.required],
        annee: ['', Validators.required]
      }),
      codeNEPH: [''],
      ville: [''],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      telephone: ['']
    });
  }

  ngOnInit(): void {
    console.log("Initialisation du composant de modification...");
    
    // Récupérer l'ID de l'élève depuis les paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      this.eleveId = params.get('id');
      console.log("ID de l'élève récupéré:", this.eleveId);
      
      if (this.eleveId) {
        this.chargerEleve(this.eleveId);
      } else {
        this.error = "ID de l'élève non spécifié";
        this.loading = false;
        console.error("Aucun ID d'élève spécifié dans l'URL");
      }
    });
  }

  chargerEleve(id: string): void {
    console.log("Tentative de chargement de l'élève avec l'ID:", id);
    
    this.apiService.getEleveById(id).subscribe({
      next: (eleve) => {
        console.log('Données élève reçues:', eleve);
        
        // Vérifier si eleve est null ou undefined
        if (!eleve) {
          this.error = "Données de l'élève non trouvées";
          this.loading = false;
          console.error("Les données de l'élève sont nulles ou non définies");
          return;
        }
        
        try {
          // Préparer des valeurs par défaut sécurisées
          const dateNaissance = eleve.datedenaissance ? new Date(eleve.datedenaissance) : new Date();
          const jour = dateNaissance.getDate().toString().padStart(2, '0');
          const mois = (dateNaissance.getMonth() + 1).toString().padStart(2, '0');
          const annee = dateNaissance.getFullYear().toString();
          
          console.log("Données formatées pour le formulaire:", {
            nom: eleve.nom || '',
            prenom: eleve.prenom || '',
            dateNaissance: { jour, mois, annee },
            codeNEPH: eleve.code_neph || '',
            ville: eleve.ville || '',
            email: eleve.email || '',
            telephone: eleve.numero || ''
          });
          
          // Mettre à jour le formulaire avec les données disponibles
          this.eleveForm.patchValue({
            nom: eleve.nom || '',
            prenom: eleve.prenom || '',
            dateNaissance: {
              jour: jour,
              mois: mois,
              annee: annee
            },
            codeNEPH: eleve.code_neph || '',
            ville: eleve.ville || '',
            email: eleve.email || '',
            motDePasse: eleve.mot_de_passe || '',
            telephone: eleve.numero || ''
          });
          
          console.log("Formulaire mis à jour avec succès");
          this.loading = false;
        } catch (err) {
          console.error("Erreur lors du traitement des données de l'élève:", err);
          this.error = "Erreur lors du traitement des données de l'élève";
          this.loading = false;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'élève:", err);
        this.error = "Impossible de charger les informations de l'élève";
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    console.log("Tentative de soumission du formulaire...");
    console.log("Valeurs du formulaire:", this.eleveForm.value);
    
    if (this.eleveForm.invalid) {
      this.error = "Veuillez remplir correctement tous les champs obligatoires";
      console.error("Formulaire invalide lors de la soumission");
      return;
    }

    if (!this.eleveId) {
      this.error = "ID de l'élève non spécifié";
      console.error("Aucun ID d'élève spécifié lors de la soumission");
      return;
    }

    const formValues = this.eleveForm.value;
    
    // Formater la date de naissance
    const dateNaissance = `${formValues.dateNaissance.annee}-${formValues.dateNaissance.mois}-${formValues.dateNaissance.jour}`;
    
    // Préparer les données pour la mise à jour
    const eleveData = {
      id: this.eleveId,
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      mot_de_passe: formValues.motDePasse,
      code_neph: formValues.codeNEPH || '',
      datedenaissance: dateNaissance,
      ville: formValues.ville || '',
      telephone: formValues.telephone || ''
    };

    console.log("Données à envoyer pour la mise à jour:", eleveData);

    this.apiService.updateEleve(eleveData).subscribe({
      next: (response) => {
        console.log('Réponse après mise à jour:', response);
        this.message = "Élève mis à jour avec succès!";
        setTimeout(() => {
          this.router.navigate(['/app-admin']);
        }, 2000);
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'élève:", err);
        this.error = "Impossible de mettre à jour l'élève: " + (err.message || 'Erreur inconnue');
      }
    });
  }

  supprimerEleve(): void {
    if (!this.eleveId) {
      this.error = "ID de l'élève non spécifié";
      return;
    }

    if (confirm("Êtes-vous sûr de vouloir supprimer cet élève? Cette action est irréversible.")) {
      console.log("Tentative de suppression de l'élève avec l'ID:", this.eleveId);
      
      this.apiService.deleteEleve(this.eleveId).subscribe({
        next: (response) => {
          console.log('Réponse après suppression:', response);
          this.message = "Élève supprimé avec succès!";
          setTimeout(() => {
            this.router.navigate(['/app-admin']);
          }, 2000);
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de l'élève:", err);
          this.error = "Impossible de supprimer l'élève: " + (err.message || 'Erreur inconnue');
        }
      });
    }
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.authService.setLogoutMessage(true);
        this.router.navigate(['/app-connexion']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }
}