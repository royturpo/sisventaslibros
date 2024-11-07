import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string) {
    this.notificationSubject.next({ type: 'success', message });
  }

  showError(message: string) {
    this.notificationSubject.next({ type: 'error', message });
  }

  showInfo(message: string) {
    this.notificationSubject.next({ type: 'info', message });
  }

  showWarning(message: string) {
    this.notificationSubject.next({ type: 'warning', message });
  }
}

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
