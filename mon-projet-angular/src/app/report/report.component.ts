import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  overdueData: any[] = [];
  monthlySummary: any = {};
  brandStats: any = {};
  statusDistribution: any = {};
  selectedDate = new Date();

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

// Modifiez la méthode logout pour utiliser le service
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

    this.loadMonthlySummary();
    this.loadBrandStats();
    this.loadStatusDistribution();
  }



  private loadMonthlySummary() {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    this.authService.getMonthlySummary(year, month).subscribe({
      next: (data) => this.monthlySummary = data,
      error: (err) => console.error('Error loading summary:', err)
    });
  }

  private loadBrandStats() {
    this.authService.getBrandStats().subscribe({
      next: (data) => {
        this.brandStats = data;
        this.renderBrandChart();
      },
      error: (err) => console.error('Error loading brand stats:', err)
    });
  }

  private loadStatusDistribution() {
    this.authService.getStatusDistribution().subscribe({
      next: (data) => {
        if (data) {
          console.log('Status Distribution Data:', data);
          this.statusDistribution = data;
          this.renderStatusChart();
        } else {
          console.warn('No data received for status distribution');
        }
      },
      error: (err) => console.error('Error loading status distribution:', err)
    });
  }

  private renderBrandChart() {
    const brands = Object.keys(this.brandStats);
    const totals = brands.map(brand => this.brandStats[brand].total_maintenances);
    
    new Chart('brandChart', {
      type: 'bar',
      data: {
        labels: brands,
        datasets: [{
          label: 'Maintenances par marque',
          data: totals,
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      }
    });
  }

  private renderStatusChart() {
    const statuses = Object.keys(this.statusDistribution);
    const counts = statuses.map(status => this.statusDistribution[status]);
    
    new Chart('statusChart', {
      type: 'pie',
      data: {
        labels: statuses,
        datasets: [{
          label: 'Répartition des statuts',
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)'
          ]
        }]
      }
    });
  }

  onDateChange() {
    this.loadMonthlySummary();
  }
}
