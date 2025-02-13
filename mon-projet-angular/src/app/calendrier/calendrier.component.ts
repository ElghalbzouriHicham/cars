import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendrier.component.html',
  styleUrl: './calendrier.component.css'
})
export class CalendrierComponent implements OnInit {
  maintenances: any[] = [];
  currentDate: Date = new Date();
  displayYear: number;
  displayMonthIndex: number;
  startingMonthIndex: number;
  selectedMaintenance: any = null;

  constructor(private router: Router, private authService: AuthService) {
    this.startingMonthIndex = this.currentDate.getMonth();
    this.displayMonthIndex = this.startingMonthIndex;
    this.displayYear = this.currentDate.getFullYear();
  }

  // Navigation methods
  goToCar() { this.router.navigate(['/add-car']); }
  goToMaintenance() { this.router.navigate(['/maintenance']); }
  goToCalendrier() { this.router.navigate(['/calendrier']); }
  goToHistory() { this.router.navigate(['/historique']); }
  goToDash() { this.router.navigate(['/dash']); }
  goToReport() { this.router.navigate(['/report']); }
  
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
    this.loadMaintenances();
  }

  loadMaintenances() {
    this.authService.get_all_maintenances().subscribe(
      data => {
        console.log('Données de maintenance:', data);
        this.maintenances = data;
      },
      error => console.error('Erreur lors du chargement des maintenances:', error)
    );
  }

  getMonthDays(month: number): number[] {
    const year = this.getYearForMonth(month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getYearForMonth(month: number): number {
    // If the display month is less than the starting month, we're in the next year
    return month < this.startingMonthIndex ? this.currentDate.getFullYear() + 1 : this.currentDate.getFullYear();
  }

  getMaintenancesForDay(month: number, day: number): any[] {
    const year = this.getYearForMonth(month);
    return this.maintenances.filter(maintenance => {
      const maintenanceDate = new Date(maintenance.next_due_date);
      return maintenanceDate.getDate() === day &&
             maintenanceDate.getMonth() === month &&
             maintenanceDate.getFullYear() === year;
    });
  }

  getMonthName(month: number): string {
    const year = this.getYearForMonth(month);
    return `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
  }

  previousMonth() {
    if (this.displayMonthIndex === this.startingMonthIndex) {
      // Can't go before the starting month
      return;
    }
    this.displayMonthIndex = this.displayMonthIndex === 0 ? 11 : this.displayMonthIndex - 1;
  }

  nextMonth() {
    const nextMonth = this.displayMonthIndex === 11 ? 0 : this.displayMonthIndex + 1;
    if (nextMonth === this.startingMonthIndex) {
      // Can't go past 12 months
      return;
    }
    this.displayMonthIndex = nextMonth;
  }

  // Modal methods
  openModal(maintenance: any) {
    this.selectedMaintenance = maintenance;
  }

  closeModal() {
    this.selectedMaintenance = null;
  }
}