import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmationRequest {
  title: string;
  message: string;
  confirmLabel: string;
  tone: 'default' | 'danger';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly requestSubject = new BehaviorSubject<ConfirmationRequest | null>(null);
  private resolver: ((confirmed: boolean) => void) | null = null;
  readonly request$ = this.requestSubject.asObservable();

  confirm(request: Omit<ConfirmationRequest, 'tone'> & { tone?: ConfirmationRequest['tone'] }): Promise<boolean> {
    this.resolver?.(false);
    return new Promise(resolve => {
      this.resolver = resolve;
      this.requestSubject.next({ ...request, tone: request.tone ?? 'default' });
    });
  }

  resolve(confirmed: boolean): void {
    this.resolver?.(confirmed);
    this.resolver = null;
    this.requestSubject.next(null);
  }
}
