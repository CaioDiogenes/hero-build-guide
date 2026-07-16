import { Component, input, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FACTION_NAVIGATION } from '../../core/constants/factions';

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './mobile-navigation.html',
  styleUrl: './mobile-navigation.scss',
})
export class MobileNavigationComponent {
  readonly open = input(false);
  readonly closeMenu = output<void>();

  readonly factions = FACTION_NAVIGATION;

  close(): void {
    this.closeMenu.emit();
  }
}