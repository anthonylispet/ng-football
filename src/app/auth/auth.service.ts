import { Injectable, NgZone } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Observable, ReplaySubject } from 'rxjs';
import { firebaseAuth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly allowedEmails = new Set([
    'anthony.lispet@gmail.com',
    'pierre.simon7041@gmail.com',
  ]);
  private readonly googleProvider = new GoogleAuthProvider();
  private readonly userSubject = new ReplaySubject<User | null>(1);

  readonly user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private readonly zone: NgZone) {
    this.googleProvider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(firebaseAuth, (user) => {
      if (user && !this.isAllowed(user)) {
        void signOut(firebaseAuth);
        this.zone.run(() => this.userSubject.next(null));
        return;
      }

      this.zone.run(() => this.userSubject.next(user));
    });
  }

  async loginWithGoogle(): Promise<void> {
    const result = await signInWithPopup(firebaseAuth, this.googleProvider);

    if (!this.isAllowed(result.user)) {
      await signOut(firebaseAuth);
      throw new UnauthorizedGoogleAccountError();
    }

    this.zone.run(() => this.userSubject.next(result.user));
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    this.zone.run(() => this.userSubject.next(null));
  }

  private isAllowed(user: User): boolean {
    return user.email !== null && this.allowedEmails.has(user.email.toLowerCase());
  }
}

export class UnauthorizedGoogleAccountError extends Error {
  constructor() {
    super('This Google account is not allowed.');
  }
}
