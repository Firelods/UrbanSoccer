import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-player-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogModule, CommonModule, FormsModule],
  templateUrl: './player-dialog.component.html',
  styleUrl: './player-dialog.component.scss',
})
export class PlayerDialogComponent {
  playerName: string = '';

  constructor(public dialogRef: MatDialogRef<PlayerDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddPlayer(): void {
    this.dialogRef.close(this.playerName);
  }
}
