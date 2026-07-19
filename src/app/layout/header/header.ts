import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);

  readonly menuToggle = output<void>();
  readonly currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  async onSignIn(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      // Popup closed/blocked by the user — nothing to recover from here.
      console.warn('Sign-in failed', error);
    }
  }

  async onSignOut(): Promise<void> {
    await this.authService.signOut();
  }
}
