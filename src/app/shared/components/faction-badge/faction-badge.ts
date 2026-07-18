import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HeroFaction } from '../../../core/models/faction.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faction-badge',
  templateUrl: './faction-badge.html',
  styleUrl: './faction-badge.scss',
})
export class FactionBadge {
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
