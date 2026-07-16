import { Component, input } from '@angular/core';

import { HeroFaction } from '../../../core/models/faction.model';

@Component({
  selector: 'app-faction-badge',
  standalone: true,
  templateUrl: './faction-badge.html',
  styleUrl: './faction-badge.scss',
})
export class FactionBadgeComponent {
  readonly faction = input.required<HeroFaction>();

  readonly labelMap: Record<HeroFaction, string> = {
    superman: 'Superman',
    technology: 'Technology',
    dark: 'Dark',
    nature: 'Nature',
    god: 'God',
    universe: 'Universe',
  };
}