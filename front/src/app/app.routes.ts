import { Routes } from '@angular/router';
import { AbsenceManagementComponent } from './components/absence-management/absence-management.component';
import { LoginComponent } from './components/login/login.component';
import { TeamOverviewComponent } from './components/team-overview/team-overview.component';
import { PitchComponent } from './components/pitch/pitch.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'team-overview', component: TeamOverviewComponent },
  { path: 'absence-management', component: AbsenceManagementComponent },
  { path: 'pitch', component: PitchComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
