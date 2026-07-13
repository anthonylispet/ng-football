import { Injectable } from '@angular/core';
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
    'pierre.simon@gmail.com',
  ]);
  private readonly googleProvider = new GoogleAuthProvider();
  private readonly userSubject = new ReplaySubject<User | null>(1);

  readonly user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.googleProvider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(firebaseAuth, (user) => {
      if (user && !this.isAllowed(user)) {
        void signOut(firebaseAuth);
        this.userSubject.next(null);
        return;
      }

      this.userSubject.next(user);
    });
  }

  async loginWithGoogle(): Promise<void> {
    const result = await signInWithPopup(firebaseAuth, this.googleProvider);

    if (!this.isAllowed(result.user)) {
      await signOut(firebaseAuth);
      throw new UnauthorizedGoogleAccountError();
    }
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
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
