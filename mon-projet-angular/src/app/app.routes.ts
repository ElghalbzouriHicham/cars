import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { AddCarComponent } from './add-car/add-car.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
    {path : "login", component : LoginComponent, canActivate: [authGuard]},
    {path : "dash", component : DashComponent, canActivate: [authGuard]},
    {path : "add-car", component : AddCarComponent, canActivate: [authGuard]},
    {path : "maintenance", component : MaintenanceComponent, canActivate: [authGuard]},
    {path : "historique", component : HistoriqueComponent, canActivate: [authGuard]},
    {path : "report", component : ReportComponent, canActivate: [authGuard]},
    {path : "calendrier", component : CalendrierComponent, canActivate: [authGuard]},
    {path : "home", component : HomeComponent},
    {path : "", redirectTo : "/home", pathMatch : 'full',},
];








