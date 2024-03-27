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
import { AuthService } from '../../services/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../services/notification.service';

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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
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
  absentPlayers: Player[] = [];
  playersAvailable: Player[] = [];
  errorGenerate: string = '';
  isAdmin: boolean;
  counterAttaquant = 0;
  counterDefenseur = 0;
  modification = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventService: NotificationService,
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/matches']);
      return;
    }
    this.apiService.getMatch(parseInt(id)).subscribe((response: Match) => {
      this.match = response;
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
    this.apiService.getAbsenceToMatch(parseInt(id)).subscribe((response) => {
      this.absentPlayers = response;
    });
    this.apiService
      .getAvailablePlayersOnMatch(this.match)
      .subscribe((response) => {
        this.playersAvailable = response;
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
        }),
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
        { x: 350, y: 350 },
      ],
      Attaquant: [
        { x: 500, y: 250 },
        { x: 500, y: 450 },
        { x: 350, y: 350 },
      ],
    };

    if (role === 'Défenseur' || role === 'Attaquant') {
      // Gérer le cas où il y a plusieurs joueurs avec le même rôle
      if (role === 'Défenseur') {
        player.position = positions[role][this.counterDefenseur];
        this.counterDefenseur++;
        return;
      } else if (role === 'Attaquant') {
        player.position = positions[role][this.counterAttaquant];
        this.counterAttaquant++;
        return;
      }
    }
    player.position = positions[role as keyof typeof positions][0];
  }

  updatePlayer(event: any, player: Player) {
    if (!this.match.id) {
      return;
    }
    this.apiService
      .updatePlayerMatch(this.match.id, player.id, event.value)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.eventService.sendSnackBarMessage(
              `Impossible de modifier le joueur ${error.message}`,
            );
          }
          // rethrow the error to be caught by the final subscribe block if needed
          return of(error);
        }),
      )
      .subscribe((res) => {
        this.modification = false;
        if (res.status > 300) {
          return;
        }
        this.eventService.sendSnackBarMessage(
          `Joueur ${player.name} modifié pour le match ${this.match.id}`,
        );
        player.id = event.value;
        let playerAdded = this.playersAvailable.find(
          (p) => p.id === event.value,
        );
        if (playerAdded) {
          player.name = playerAdded.name;
        }
      });
  }

  modify() {
    this.modification = true;
  }
}
