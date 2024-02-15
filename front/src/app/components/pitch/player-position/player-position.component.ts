import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerDialogComponent } from '../player-dialog/player-dialog.component';

@Component({
  selector: 'app-player-position',
  standalone: true,
  imports: [],
  templateUrl: './player-position.component.html',
  styleUrl: './player-position.component.scss',
})
export class PlayerPositionComponent {
  @Output() playerAdded = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {}

  openPlayerDialog() {
    const dialogRef = this.dialog.open(PlayerDialogComponent, {
      width: '250px',
      // Additional dialog options if needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.playerAdded.emit(result);
      }
    });
  }
}
