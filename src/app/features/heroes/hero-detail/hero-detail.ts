import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, of, tap } from 'rxjs';
import { ArtifactImageService } from '../../../core/services/artifact-image.service';
import { AuthService } from '../../../core/services/auth.service';
import { CollectionImageService } from '../../../core/services/collection-image.service';
import { GemImageService } from '../../../core/services/gem-image.service';
import { HeroImageService } from '../../../core/services/hero-image.service';
import { HeroService } from '../../../core/services/hero.service';
import { StigmaImageService } from '../../../core/services/stigma-image.service';
import { createImageFallback } from '../../../core/utils/image-fallback';
import { BuildSection } from '../../../shared/components/build-section/build-section';
import { Chip } from '../../../shared/components/chip/chip';
import { FactionBadge } from '../../../shared/components/faction-badge/faction-badge';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';
import { TierBadge } from '../../../shared/components/tier-badge/tier-badge';
import { HeroEdit } from '../hero-edit/hero-edit';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-detail',
  imports: [
    AsyncPipe,
    RouterLink,
    BuildSection,
    Chip,
    FactionBadge,
    HeroEdit,
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
  private readonly authService = inject(AuthService);

  readonly isEditor = toSignal(this.authService.isEditor$, { initialValue: false });
  readonly showEditModal = signal(false);
  readonly heroImageService = inject(HeroImageService);
  readonly fallback = createImageFallback();

  readonly gemIcon = this.iconResolver(inject(GemImageService));
  readonly artifactIcon = this.iconResolver(inject(ArtifactImageService));
  readonly stigmaIcon = this.iconResolver(inject(StigmaImageService));
  readonly collectionIcon = this.iconResolver(inject(CollectionImageService));

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),

    tap(() => this.fallback.reset()),

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

  private iconResolver<T extends { getImageUrl(name: string): string | undefined }>(service: T) {
    return (name: string) => service.getImageUrl(name);
  }
}
