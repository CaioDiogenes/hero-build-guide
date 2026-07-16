import { AsyncPipe } from "@angular/common";
import { Component, inject, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Title } from "@angular/platform-browser";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { map, switchMap, catchError, of, tap } from "rxjs";
import { HeroService } from "../../../core/services/hero.service";
import { BuildSection } from "../../../shared/components/build-section/build-section";
import { ChipComponent } from "../../../shared/components/chip/chip";
import { FactionBadgeComponent } from "../../../shared/components/faction-badge/faction-badge";
import { PanelComponent } from "../../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../../shared/components/status-message/status-message";
import { TierBadgeComponent } from "../../../shared/components/tier-badge/tier-badge";

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    BuildSection,
    ChipComponent,
    FactionBadgeComponent,
    PanelComponent,
    StatusMessageComponent,
    TierBadgeComponent,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.scss',
})
export class HeroDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly heroService = inject(HeroService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),

    switchMap((slug) =>
      this.heroService
        .getHeroNavigationBySlug(slug)
        .pipe(
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
        hero
          ? `${hero.name} Build | Hero Build Guide`
          : 'Hero Not Found | Hero Build Guide',
      );
    }),

    takeUntilDestroyed(this.destroyRef),
  );
}