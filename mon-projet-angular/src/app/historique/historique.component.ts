import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



interface GroupedMaintenance {
  brand: string;
  model: string;
  plate_number: string;
  maintenances: any[];
}
@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})


export class HistoriqueComponent {
  completedMaintenances: any[] = [];
  groupedMaintenances: GroupedMaintenance[] = [];
  cars: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}
  goToCar() {
    this.router.navigate(['/add-car']);
  }
  goToMaintenance() {
    this.router.navigate(['/maintenance']);
  }
  goToCalendrier() {
    this.router.navigate(['/calendrier']);
  }
  goToHistory() {
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
  ngOnInit() {
    // Charger toutes les voitures
    this.authService.get_all_cars().subscribe(
      (cars) => (this.cars = cars)
    );

    // Charger toutes les maintenances complétées initialement
    this.loadCompletedMaintenances();
  }

  loadCompletedMaintenances(carId?: number) {
    this.authService.getCompletedMaintenances(carId).subscribe(
      (maintenances) => {
        this.completedMaintenances = maintenances;
        this.groupMaintenancesByCar();
      }
    );
  }

  groupMaintenancesByCar() {
    const grouped: { [key: number]: GroupedMaintenance } = {}; // 🛠 Correction : définir un type indexé

    this.completedMaintenances.forEach((maintenance) => {
      const carId = maintenance.car_id as number;

      if (!grouped[carId]) {
        grouped[carId] = {
          brand: maintenance.brand,
          model: maintenance.model,
          plate_number: maintenance.plate_number,
          maintenances: [],
        };
      }
      grouped[carId].maintenances.push(maintenance);
    });

    this.groupedMaintenances = Object.values(grouped);
  }

  onCarSelect(event: any) {
    const carId = event.target.value;
    this.loadCompletedMaintenances(carId ? parseInt(carId) : undefined);
  }
}
