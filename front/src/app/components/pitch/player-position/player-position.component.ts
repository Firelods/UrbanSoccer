import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../../interfaces/player';

@Component({
  selector: 'app-player-position',
  standalone: true,
  imports: [],
  templateUrl: './player-position.component.html',
  styleUrl: './player-position.component.scss',
})
export class PlayerPositionComponent {
  @Output() playerSelected: Player | undefined;
  @Input() availablePlayers: Player[] = [];

  constructor() {}
}
