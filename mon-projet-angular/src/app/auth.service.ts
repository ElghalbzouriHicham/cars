import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, finalize, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5000/api';
  authStatusChanged = new EventEmitter<void>();

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
// Dans votre AuthService Angular
// Modifiez la méthode removeToken pour inclure le token dans les headers
// auth.service.ts
  removeToken() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      finalize(() => {
        localStorage.removeItem('authToken');
        this.authStatusChanged.emit();
      })
    );
  }

  getUpcomingMaintenances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/maintenance/upcoming`);
  }
  get_all_cars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-cars`);
  }

  create_maintenance(maintenanceData: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/maintenance`, maintenanceData);
  }

  add_car(carData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cars`, carData);
  }
  update_car(carId: number, carData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cars/${carId}`, carData);
  }
  
  delete_car(carId: number): Observable<any> {
    // Utiliser directement l'ID sans encoder l'objet
    return this.http.delete(`${this.apiUrl}/cars/${carId}`);
  }
  get_all_maintenances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/maintenance/all`);
  }

  updateMaintenance(maintenanceId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/maintenance/${maintenanceId}`, data);
   }
   
  deleteMaintenance(maintenanceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/maintenance/${maintenanceId}`);
  }

  triggerNotifications(): Observable<any> {
    return this.http.post(`${this.apiUrl}/maintenance/notifications`, {});
  }

  getCompletedMaintenances(carId?: number): Observable<any> {
    let url = `${this.apiUrl}/maintenance/completed`;
    if (carId) {
      url += `?car_id=${carId}`;
    }
    return this.http.get(url);
  }

  getOverdueMaintenances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/overdue`);
  }

  getMonthlySummary(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/monthly-summary?year=${year}&month=${month}`);
  }

  getBrandStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/brand-stats`);
  }
  // Dans report.service.ts
  getStatusDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/status-distribution`).pipe(
      catchError((error) => {
        console.error('Error fetching status distribution:', error);
        return of(null); // Retourne une valeur par défaut en cas d'erreur
      })
    );
  }
}
