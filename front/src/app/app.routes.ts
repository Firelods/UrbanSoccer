import { Routes } from '@angular/router';
import { AbsenceManagementComponent } from './components/absence-management/absence-management.component';
import { LoginComponent } from './components/login/login.component';
import { TeamOverviewComponent } from './components/team-overview/team-overview.component';
import { PitchComponent } from './components/pitch/pitch.component';
import { RegisterComponent } from './components/register/register.component';
import { MatchesComponent } from './components/matches/matches.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'team-overview/:id', component: TeamOverviewComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'absence-management', component: AbsenceManagementComponent },
  { path: 'pitch/:id', component: PitchComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
