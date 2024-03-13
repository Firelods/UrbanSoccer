import { Routes } from '@angular/router';
import { AbsenceManagementComponent } from './components/absence-management/absence-management.component';
import { LoginComponent } from './components/login/login.component';
import { TeamOverviewComponent } from './components/team-overview/team-overview.component';
import { PitchComponent } from './components/pitch/pitch.component';
import { RegisterComponent } from './components/register/register.component';
import { MatchesComponent } from './components/matches/matches.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { GestionJoueurComponent } from './components/gestion-joueur/gestion-joueur.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'team-overview/:id',
    component: TeamOverviewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuard] },
  {
    path: 'absence-management',
    component: AbsenceManagementComponent,
    canActivate: [AuthGuard],
  },
  { path: 'pitch/:id', component: PitchComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'activity',
    component: GestionJoueurComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
