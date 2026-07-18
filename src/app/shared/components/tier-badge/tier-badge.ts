import { Component, input } from '@angular/core';
import { HeroTier } from '../../../core/models/hero.model';

@Component({
  selector: 'app-tier-badge',
  templateUrl: './tier-badge.html',
  styleUrl: './tier-badge.scss',
})
export class TierBadge {
  readonly tier = input.required<HeroTier>();
}
