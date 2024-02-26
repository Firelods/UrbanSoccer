import { Component } from '@angular/core';
import { PlayerPositionComponent } from './player-position/player-position.component';
import { CommonModule } from '@angular/common';
import { Match } from '../../interfaces/match';
import { Team } from '../../interfaces/team';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Player } from '../../interfaces/player';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError, of } from 'rxjs';
import { CustomDatePipe } from '../../pipe/date.pipe';

@Component({
  selector: 'app-pitch',
  standalone: true,
  templateUrl: './pitch.component.html',
  styleUrl: './pitch.component.scss',
  imports: [
    PlayerPositionComponent,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    CustomDatePipe,
  ],
})
export class PitchComponent {
  positions: string[] = [
    'Gardien',
    'Défenseur',
    'Défenseur',
    'Attaquant',
    'Attaquant',
  ];
  rolePlaced: string[] = [];
  match: Match = {
    id: 1,
    date: new Date(),
    opponent: 'PSG',
    team_id: 1,
  };
  date: string = '';
  team: Team = {
    id: 1,
    name: 'Equipe 1',
    players: [],
  };
  errorGenerate: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/matches']);
      return;
    }
    this.apiService.getMatch(parseInt(id)).subscribe((response: Match) => {
      this.match = response;
      console.log(this.match);
      // format date with time
      let date = new Date(this.match.date);
      this.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      if (this.match.team_id) {
        this.apiService
          .getTeam(this.match.team_id)
          .subscribe((response: Team) => {
            this.team = response;
            this.setAllPlayersPosition();
          });
      }
    });
  }

  createTeam() {
    this.apiService
      .createTeam(this.match)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            this.errorGenerate = error.error.message;
          }
          // rethrow the error to be caught by the final subscribe block if needed
          return of(error);
        })
      )
      .subscribe((response: any) => {
        if (response.status > 300) {
          return;
        }
        this.team = response.team;
        this.match.team_id = this.team.id;
        this.setAllPlayersPosition();
      });
  }

  setAllPlayersPosition() {
    this.team.players.forEach((player) => {
      this.setRolePosition(player.role, player);
    });
  }

  setRolePosition(role: string, player: Player): void {
    const positions = {
      Gardien: [{ x: 50, y: 335 }], // Exemple de coordonnées, à ajuster selon le SVG
      Défenseur: [
        { x: 200, y: 450 },
        { x: 200, y: 250 },
      ],
      Attaquant: [
        { x: 500, y: 250 },
        { x: 500, y: 450 },
      ],
    };

    if (role === 'Défenseur' || role === 'Attaquant') {
      // Gérer le cas où il y a plusieurs joueurs avec le même rôle
      if (role === 'Défenseur') {
        if (this.rolePlaced.includes('Défenseur')) {
          player.position = positions[role][1];
          return;
        }
        this.rolePlaced.push(role);
        player.position = positions[role][0];
        return;
      } else if (role === 'Attaquant') {
        if (this.rolePlaced.includes('Attaquant')) {
          player.position = positions[role][1];
          return;
        }
        this.rolePlaced.push(role);
        player.position = positions[role][0];
        return;
      }
    }
    player.position = positions[role as keyof typeof positions][0];
  }
}
