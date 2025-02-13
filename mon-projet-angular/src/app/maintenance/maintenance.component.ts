import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [FormsModule , CommonModule,RouterModule, CommonModule, HttpClientModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {
  maintenances: any[] = []; // Pour stocker les données des maintenances
  selectedMaintenance: any = {};
  errorMessage: string = '';

  constructor(private router: Router,    private authService: AuthService){
  }
  goToCar() {
    this.router.navigate(['/add-car']);
  }
  goToMaintenance() {
    this.router.navigate(['/maintenance']);
  }
  goToCalendrier(){
    this.router.navigate(['/calendrier']);
  }
  goToHistory(){
    this.router.navigate(['/historique']);
  }
  goToDash() {
    this.router.navigate(['/dash']);
  }
  goToReport() {
    this.router.navigate(['/report']);
  }
  logout() {
    this.authService.removeToken().subscribe({
      next: () => {
        // Redirection après succès
        this.router.navigate(['/home']).then(() => {
          window.location.reload(); // Rechargement pour nettoyer l'état
        });
      },
      error: (error) => {
        console.error('Échec de la déconnexion:', error);
        // Gestion d'erreur optionnelle
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit(): void {
    this.get_all_cars();
  }

  // Méthode pour charger les maintenances à venir
  get_all_cars(): void {
    this.authService.get_all_cars().subscribe(
      (data) => {
        this.maintenances = data; // Stocker les données dans la variable
      },
      (error) => {
        console.error('Erreur lors de la récupération des maintenances :', error);
      }
    );
  }

  isModalOpen = false;
  selectedCar: any = null;
  maintenanceData = {
    car_id: null,
    type: '',
    last_done_date: ''
  };
  openMaintenanceModal(car: any) {
    this.selectedCar = car;
    this.maintenanceData.car_id = car.id;
    this.isModalOpen = true;
  }

    // Vérifie si le traitement a déjà été effectué pour cette voiture
  isTreatmentDone(car: any, type: string): boolean {
    return car.treatments?.some((treatment: any) => treatment.type === type);
  }
  createMaintenance() {
    this.authService.create_maintenance(this.maintenanceData).subscribe(
      (response) => {
        console.log('Maintenance créée', response);
        alert('Maintenance enregistrée avec succès.');
  
        // Mettre à jour la liste localement
        if (!this.selectedCar.treatments) {
          this.selectedCar.treatments = [];
        }
        this.selectedCar.treatments.push({
          type: this.maintenanceData.type,
          last_done_date: this.maintenanceData.last_done_date
        });
  
        this.closeModal();
      },
      (error) => {
        console.error('Erreur de création', error);
        
        // Vérifie si l'erreur est due à une maintenance déjà existante
        if (error.status === 400 && error.error?.error.includes('existe déjà')) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
        }
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCar = null;
    // Réinitialiser les données de maintenance
    this.maintenanceData = {
      car_id: null,
      type: '',
      last_done_date: ''
    };
  }

}
