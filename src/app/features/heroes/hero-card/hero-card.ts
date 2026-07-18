import { Component, input, inject, signal } from '@angular/core';
import { Hero } from '../../../core/models/hero.model';
import { HeroImageService } from '../../../core/services/hero-image.service';
import { Chip } from '../../../shared/components/chip/chip';
import { FactionBadge } from '../../../shared/components/faction-badge/faction-badge';
import { TierBadge } from '../../../shared/components/tier-badge/tier-badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.html',
  imports: [Chip, FactionBadge, TierBadge, RouterLink],
  styleUrl: './hero-card.scss',
})
export class HeroCard {
  readonly hero = input.required<Hero>();
  readonly heroImageService = inject(HeroImageService);
  readonly imageFailed = signal(false);

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
