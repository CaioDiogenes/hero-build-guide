import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, of, tap } from 'rxjs';
import { HeroImageService } from '../../../core/services/hero-image.service';
import { HeroService } from '../../../core/services/hero.service';
import { BuildSection } from '../../../shared/components/build-section/build-section';
import { Chip } from '../../../shared/components/chip/chip';
import { FactionBadge } from '../../../shared/components/faction-badge/faction-badge';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';
import { TierBadge } from '../../../shared/components/tier-badge/tier-badge';

@Component({
  selector: 'app-hero-detail',
  imports: [
    AsyncPipe,
    RouterLink,
    BuildSection,
    Chip,
    FactionBadge,
    Panel,
    StatusMessage,
    TierBadge,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.scss',
})
export class HeroDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly heroService = inject(HeroService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly heroImageService = inject(HeroImageService);
  readonly imageFailed = signal(false);

  onImageError(): void {
    this.imageFailed.set(true);
  }

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),

    tap(() => this.imageFailed.set(false)),

    switchMap((slug) =>
      this.heroService.getHeroNavigationBySlug(slug).pipe(
        map((navigation) => ({
          navigation,
          error: false,
        })),

        catchError(() =>
          of({
            navigation: undefined,
            error: true,
          }),
        ),
      ),
    ),

    tap((viewModel) => {
      const hero = viewModel.navigation?.hero;

      this.title.setTitle(
        hero ? `${hero.name} Build | Hero Build Guide` : 'Hero Not Found | Hero Build Guide',
      );
    }),

    takeUntilDestroyed(this.destroyRef),
  );
}
