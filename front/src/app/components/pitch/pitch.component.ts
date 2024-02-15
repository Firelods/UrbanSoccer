import { Component } from '@angular/core';
import { PlayerPositionComponent } from './player-position/player-position.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pitch',
  standalone: true,
  templateUrl: './pitch.component.html',
  styleUrl: './pitch.component.scss',
  imports: [PlayerPositionComponent, CommonModule],
})
export class PitchComponent {
  positions: string[] = [
    'Goalkeeper',
    'Defender',
    'Defender',
    'Midfielder',
    'Midfielder',
    'Striker',
  ];
}
