import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export class DashComponent implements OnInit{

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
  upcomingMaintenances: any[] = [];

  ngOnInit() {
    this.loadUpcomingMaintenances();
  }

  loadUpcomingMaintenances() {
    this.authService.getUpcomingMaintenances().subscribe({
      next: (maintenances) => {
        this.upcomingMaintenances = maintenances;
      },
      error: (error) => {
        console.error('Error fetching upcoming maintenances', error);
      }
    });
  }
  // Méthode pour éditer la date de maintenance
  editMaintenance(maintenanceId: number) {
    const newDate = prompt("Enter the new maintenance date (YYYY-MM-DD):");
    if (newDate) {
      this.authService.updateMaintenance(maintenanceId, { maintenance_date: newDate }).subscribe({
        next: () => {
          alert("Maintenance updated successfully!");
          this.loadUpcomingMaintenances();
        },
        error: (error) => {
          console.error('Error updating maintenance:', error);
          alert("Failed to update maintenance.");
        }
      });
    }
  }

  // Méthode pour supprimer un enregistrement de maintenance
  deleteMaintenance(maintenanceId: number) {
    if (confirm("Are you sure you want to delete this maintenance record?")) {
      this.authService.deleteMaintenance(maintenanceId).subscribe({
        next: () => {
          alert("Maintenance deleted successfully!");
          this.loadUpcomingMaintenances();
        },
        error: (error) => {
          console.error('Error deleting maintenance:', error);
          alert("Failed to delete maintenance.");
        }
      });
    }
  }


}
