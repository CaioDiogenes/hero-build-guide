import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FACTION_NAVIGATION } from '../../core/constants/factions';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  readonly factions = FACTION_NAVIGATION;
}