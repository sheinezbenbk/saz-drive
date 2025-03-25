import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-pageavis',
  standalone: false,
  templateUrl: './pageavis.component.html',
  styleUrls: ['./pageavis.component.css']
})
export class PageavisComponent implements OnInit {
  avisForm: FormGroup;
  listeAvis: any[] = [];
  message: string = '';
  isError: boolean = false;
  isSuccess: boolean = false;
  utilisateurId: number | undefined;
  userInfo: any = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.avisForm = this.fb.group({
      commentaire: ['', Validators.required],
      titre: ['', Validators.required]
    });
    
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userInfo = JSON.parse(userStr);
      this.utilisateurId = this.userInfo.id;
      console.log('Utilisateur connecté:', this.userInfo);
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }

  ngOnInit(): void {
    this.chargerAvis();
  }

  chargerAvis() {
    this.apiService.getAvis().subscribe({
      next: (data) => {
        console.log('Avis chargés:', data);
        this.listeAvis = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.afficherMessage('Impossible de charger les avis', true);
      }
    });
  }

  soumettreAvis() {
    if (this.avisForm.valid && this.utilisateurId) {
      const avis = {
        id_utilisateur: this.utilisateurId,
        commentaire: this.avisForm.value.commentaire,
        titre: this.avisForm.value.titre.toUpperCase(),
      };
      
      console.log('Envoi de l\'avis:', avis);
      
      this.apiService.ajouterAvis(avis).subscribe({
        next: (reponse) => {
          console.log('Réponse après ajout:', reponse);
          this.afficherMessage('Votre avis a été ajouté avec succès!', false);
          this.avisForm.reset({
            titre: 'SUPER PRÉPARATION POUR LE CODE !'
          });
          this.chargerAvis(); // Recharger la liste des avis
        },
        error: (erreur) => {
          console.error('Erreur lors de l\'ajout de l\'avis:', erreur);
          this.afficherMessage('Erreur lors de l\'ajout de l\'avis: ' + (erreur.message || 'Erreur inconnue'), true);
        }
      });
    } else {
      if (!this.utilisateurId) {
        this.afficherMessage('Vous devez être connecté pour laisser un avis', true);
      } else {
        this.afficherMessage('Veuillez remplir tous les champs obligatoires', true);
      }
    }
  }

  afficherMessage(msg: string, estErreur: boolean) {
    this.message = msg;
    this.isError = estErreur;
    this.isSuccess = !estErreur;
    
    setTimeout(() => {
      this.message = '';
      this.isError = false;
      this.isSuccess = false;
    }, 3000);
  }
}