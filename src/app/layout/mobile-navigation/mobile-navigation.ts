import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { FACTION_NAVIGATION } from '../../core/constants/factions';
import { AuthService } from '../../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-navigation.html',
  styleUrl: './mobile-navigation.scss',
})
export class MobileNavigation {
  private readonly authService = inject(AuthService);

  readonly open = input(false);
  readonly closeMenu = output<void>();

  readonly factions = FACTION_NAVIGATION;
  readonly currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  close(): void {
    this.closeMenu.emit();
  }

  async onSignIn(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
    } catch {
      // Popup closed/blocked by the user — nothing to recover from here.
    }

    this.close();
  }

  async onSignOut(): Promise<void> {
    await this.authService.signOut();
    this.close();
  }
}
