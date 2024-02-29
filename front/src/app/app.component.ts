import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'urban-soccer';

  constructor(
    private _snackBar: MatSnackBar,
    private eventService: NotificationService
  ) {
    this.eventService.snackBar$.subscribe((message) => {
      this.openSnackBar(message);
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 2 * 1000,
    });
  }
}
