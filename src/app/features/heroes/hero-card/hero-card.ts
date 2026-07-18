import { Component, input, inject, signal } from "@angular/core";
import { Hero } from "../../../core/models/hero.model";
import { HeroImageService } from "../../../core/services/hero-image.service";
import { ChipComponent } from "../../../shared/components/chip/chip";
import { FactionBadgeComponent } from "../../../shared/components/faction-badge/faction-badge";
import { TierBadgeComponent } from "../../../shared/components/tier-badge/tier-badge";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hero-card',
  standalone: true,
  templateUrl: './hero-card.html',
  imports: [
    ChipComponent,
    FactionBadgeComponent,
    TierBadgeComponent,
    RouterLink
  ],
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