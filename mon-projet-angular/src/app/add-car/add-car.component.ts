import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule,
    FormsModule,      
    HttpClientModule],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent {
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
  cars: any[] = [];  // Liste des voitures existantes
  isModalOpen = false;  // Statut du modal
  isUpdating = false; // Indique si on est en mode mise à jour
  carIdToUpdate: number | null = null;

  carData = {
    plate_number: '',
    brand: '',
    model: '',
    year: null,
    mileage: 0,
    status: 'available'
  };

  ngOnInit(): void {
    this.getCars(); // Charger les voitures existantes lors de l'initialisation
  }

  // Charger toutes les voitures
  getCars(): void {
    this.authService.get_all_cars().subscribe((cars) => {
      this.cars = cars;
    });
  }

  // Vérifier si une voiture existe déjà avec le même plate_number
  checkDuplicateCar(): boolean {
    return this.cars.some(car => car.plate_number === this.carData.plate_number);
  }

  // Ouvrir le modal d'ajout
  openModal(): void {
    this.isUpdating = false;
    this.resetForm();
    this.isModalOpen = true;
  }

  // Ouvrir le modal pour modifier une voiture
  openUpdateModal(car: any): void {
    this.isUpdating = true;
    this.carIdToUpdate = car.id;
    this.carData = { ...car }; // Copier les valeurs de la voiture existante
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Ajouter une voiture
  addCar(): void {
    if (this.checkDuplicateCar()) {
      alert('A car with this plate number already exists!');
      return;
    }

    this.authService.add_car(this.carData).subscribe(
      (response) => {
        console.log('Car added successfully:', response);
        alert('Car added successfully!');
        this.getCars(); // Rafraîchir la liste
        this.closeModal();
      },
      (error) => {
        console.error('Error adding car:', error);
        alert('Failed to add car.');
      }
    );
  }

  // Mettre à jour une voiture
  updateCar(): void {
    if (!this.carIdToUpdate) return;

    this.authService.update_car(this.carIdToUpdate, this.carData).subscribe(
      (response) => {
        console.log('Car updated successfully:', response);
        alert('Car updated successfully!');
        this.getCars(); // Rafraîchir la liste
        this.closeModal();
      },
      (error) => {
        console.error('Error updating car:', error);
        alert('Failed to update car.');
      }
    );
  }

  // Supprimer une voiture
  deleteCar(carId: number): void {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }
    
    this.authService.delete_car(carId).subscribe({
      next: (response) => {
        console.log('Car deleted successfully:', response);
        this.getCars(); // Rafraîchir la liste
      },
      error: (error) => {
        console.error('Error deleting car:', error);
        alert('Failed to delete car: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }
  // Réinitialiser le formulaire
  resetForm(): void {
    this.carData = {
      plate_number: '',
      brand: '',
      model: '',
      year: null,
      mileage: 0,
      status: 'available'
    };
    this.carIdToUpdate = null;
  }
}