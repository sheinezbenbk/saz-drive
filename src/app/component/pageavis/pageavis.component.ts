import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-pageavis',
  standalone:false, 
  templateUrl: './pageavis.component.html',
  styleUrls: ['./pageavis.component.css']
})
export class PageavisComponent implements OnInit {
  avisForm: FormGroup;
  listeAvis: any[] = [];
  message: string = '';
  isError: boolean = false;
  isSuccess: boolean = false;
  utilisateurId: number | undefined

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService, 
    
  ) {
    this.avisForm = this.fb.group({
      commentaire: ['', Validators.required],
      titre: ['SUPER PRÉPARATION POUR LE CODE !']
    });
    
    // Récupérer l'ID de l'utilisateur depuis le localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.utilisateurId = user.id;
    }
  }

  ngOnInit(): void {
    this.chargerAvis();
  }

  chargerAvis() {
    this.apiService.getAvis().subscribe({
      next: (data) => {
        this.listeAvis = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
      }
    });
  }

  soumettreAvis() {
    if (this.avisForm.valid && this.utilisateurId) {
      const avis = {
        id_utilisateur: this.utilisateurId,
        commentaire: this.avisForm.value.commentaire,
        titre: this.avisForm.value.titre
      };
      
      this.apiService.ajouterAvis(avis).subscribe({
        next: (reponse) => {
          this.afficherMessage('Votre avis a été ajouté avec succès!', false);
          this.avisForm.reset({
            titre: 'SUPER PRÉPARATION POUR LE CODE !'
          });
          this.chargerAvis();
        },
        error: (erreur) => {
          console.error('Erreur lors de l\'ajout de l\'avis:', erreur);
          this.afficherMessage('Erreur lors de l\'ajout de l\'avis', true);
        }
      });
    } else {
      this.afficherMessage('Veuillez remplir tous les champs obligatoires ou vous connecter', true);
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