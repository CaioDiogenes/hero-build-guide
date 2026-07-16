import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Hero } from "../../../core/models/hero.model";
import { ChipComponent } from "../../../shared/components/chip/chip";
import { FactionBadgeComponent } from "../../../shared/components/faction-badge/faction-badge";
import { TierBadgeComponent } from "../../../shared/components/tier-badge/tier-badge";

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [
    RouterLink,
    ChipComponent,
    FactionBadgeComponent,
    TierBadgeComponent,
  ],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.scss',
})
export class HeroCard {
  readonly hero = input.required<Hero>();
}