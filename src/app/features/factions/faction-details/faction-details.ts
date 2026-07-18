import { AsyncPipe } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map, switchMap, of, catchError, tap } from 'rxjs';
import { getFactionBySlug } from '../../../core/constants/factions';
import { HERO_TIER_OPTIONS } from '../../../core/constants/hero-options';
import { FactionTierSummary } from '../../../core/models/faction-tier-summary.model';
import { Hero } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { HeroCard } from '../../heroes/hero-card/hero-card';
import { FactionBadge } from '../../../shared/components/faction-badge/faction-badge';
import { StatusMessage } from '../../../shared/components/status-message/status-message';
import { TierBadge } from '../../../shared/components/tier-badge/tier-badge';

@Component({
  selector: 'app-faction-detail',
  imports: [AsyncPipe, RouterLink, FactionBadge, HeroCard, StatusMessage, TierBadge],
  templateUrl: './faction-details.html',
  styleUrl: './faction-details.scss',
})
export class FactionDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly heroService = inject(HeroService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),

    switchMap((slug) => {
      const faction = getFactionBySlug(slug);

      if (!faction) {
        return of({
          faction: undefined,
          heroes: [] as Hero[],
          tierSummary: [] as FactionTierSummary[],
          error: false,
        });
      }

      return this.heroService.getHeroesByFaction(faction.id).pipe(
        map((heroes) => ({
          faction,
          heroes: [...heroes].sort((first, second) => first.name.localeCompare(second.name)),
          tierSummary: this.createTierSummary(heroes),
          error: false,
        })),

        catchError(() =>
          of({
            faction,
            heroes: [] as Hero[],
            tierSummary: [] as FactionTierSummary[],
            error: true,
          }),
        ),
      );
    }),

    tap((viewModel) => {
      this.title.setTitle(
        viewModel.faction
          ? `${viewModel.faction.name} | Hero Build Guide`
          : 'Faction Not Found | Hero Build Guide',
      );
    }),

    takeUntilDestroyed(this.destroyRef),
  );

  private createTierSummary(heroes: Hero[]): FactionTierSummary[] {
    return HERO_TIER_OPTIONS.map(({ value: tier }) => ({
      tier,
      count: heroes.filter((hero) => hero.tier === tier).length,
    }));
  }
}
