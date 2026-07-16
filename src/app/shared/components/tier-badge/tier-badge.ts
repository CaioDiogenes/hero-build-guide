import { Component, input } from "@angular/core";
import { HeroTier } from "../../../core/models/hero.model";

@Component({
  selector: 'app-tier-badge',
  standalone: true,
  templateUrl: './tier-badge.html',
  styleUrl: './tier-badge.scss',
})
export class TierBadgeComponent {
  readonly tier = input.required<HeroTier>();
}