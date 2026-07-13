import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AuthService, UnauthorizedGoogleAccountError } from '../auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginError: 'unauthorized' | 'generic' | null = null;
  submitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  async loginWithGoogle(): Promise<void> {
    this.loginError = null;
    this.submitting = true;

    try {
      await this.authService.loginWithGoogle();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/';

      await this.router.navigateByUrl(destination);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedGoogleAccountError) {
        this.loginError = 'unauthorized';
      } else if (error instanceof FirebaseError && error.code !== 'auth/popup-closed-by-user') {
        this.loginError = 'generic';
      }
    } finally {
      this.submitting = false;
    }
  }
}
