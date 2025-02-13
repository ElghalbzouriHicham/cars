import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule , CommonModule,RouterModule, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  credentials = {
    email: '',
    password: ''
  };

  isLoginModalOpen = false;
  loginErrorMessage: string | null = null;

  constructor(    
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {}

  // Ouvrir la modal de connexion
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.loginErrorMessage = null; // Réinitialiser les messages d'erreur
  }

  // Fermer la modal
  closeModal() {
    this.isLoginModalOpen = false;
  }

  // Gérer la soumission du formulaire de connexion
  login(credentials: { email: string, password: string }) {
    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Connexion réussie:', response);
        this.authService.saveToken(response.token); // Sauvegarder le token
        this.closeModal();
        this.router.navigate(['/dash']); // Rediriger vers le tableau de bord
      },
      (error) => {
        console.error('Erreur de connexion:', error);
        this.loginErrorMessage = error?.error?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      }
    );
  }

}
