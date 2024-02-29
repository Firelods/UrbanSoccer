import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _snackBarSubject = new Subject<string>();

  // Observable to be subscribed to
  public snackBar$ = this._snackBarSubject.asObservable();

  // Function to call to send a snackbar message
  sendSnackBarMessage(message: string) {
    this._snackBarSubject.next(message);
  }
}
