import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { Hero } from '../../../core/models/hero.model';
import { HeroImageService } from '../../../core/services/hero-image.service';
import { createImageFallback } from '../../../core/utils/image-fallback';
import { Chip } from '../../../shared/components/chip/chip';
import { FactionBadge } from '../../../shared/components/faction-badge/faction-badge';
import { TierBadge } from '../../../shared/components/tier-badge/tier-badge';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-card',
  templateUrl: './hero-card.html',
  imports: [Chip, FactionBadge, TierBadge, RouterLink],
  styleUrl: './hero-card.scss',
})
export class HeroCard {
  readonly hero = input.required<Hero>();
  readonly heroImageService = inject(HeroImageService);
  readonly fallback = createImageFallback();
}
