import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, catchError, of, combineLatest } from 'rxjs';
import { HeroFilterState, HeroSortOption } from '../../../core/models/hero-filter.model';
import { Hero } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { HeroCard } from '../hero-card/hero-card';
import { HeroFilters } from '../hero-filters/hero-filters';
import { StatusMessage } from '../../../shared/components/status-message/status-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-directory',
  imports: [AsyncPipe, HeroCard, HeroFilters, StatusMessage],
  templateUrl: './hero-directory.html',
  styleUrl: './hero-directory.scss',
})
export class HeroDirectory {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly initialFilters = this.readFiltersFromQueryParams();

  private readonly filtersSubject = new BehaviorSubject<HeroFilterState>(this.initialFilters);

  readonly filters$ = this.filtersSubject.asObservable();

  readonly heroesResult$ = this.heroService.getHeroes().pipe(
    map((heroes) => ({
      heroes,
      error: false,
    })),

    catchError(() =>
      of({
        heroes: [] as Hero[],
        error: true,
      }),
    ),
  );

  readonly viewModel$ = combineLatest([this.heroesResult$, this.filters$]).pipe(
    map(([result, filters]) => {
      const filteredHeroes = this.filterHeroes(result.heroes, filters);

      return {
        heroes: filteredHeroes,
        totalHeroes: result.heroes.length,
        visibleHeroes: filteredHeroes.length,
        filters,
        error: result.error,
      };
    }),
  );

  onFiltersChanged(filters: HeroFilterState): void {
    this.filtersSubject.next(filters);
    this.updateQueryParams(filters);
  }

  onFiltersCleared(): void {
    const defaultFilters = this.createDefaultFilters();

    this.filtersSubject.next(defaultFilters);
    this.updateQueryParams(defaultFilters);
  }

  private filterHeroes(heroes: Hero[], filters: HeroFilterState): Hero[] {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const filtered = heroes.filter((hero) => {
      const matchesSearch =
        !normalizedSearch ||
        hero.name.toLowerCase().includes(normalizedSearch) ||
        hero.title?.toLowerCase().includes(normalizedSearch);

      const matchesFaction = !filters.faction || hero.faction === filters.faction;

      const matchesTier = !filters.tier || hero.tier === filters.tier;

      const matchesType = !filters.type || hero.types.includes(filters.type);

      return matchesSearch && matchesFaction && matchesTier && matchesType;
    });

    return this.sortHeroes(filtered, filters.sort);
  }

  private sortHeroes(heroes: Hero[], sort: HeroSortOption): Hero[] {
    const tierOrder: Record<Hero['tier'], number> = {
      'S+': 4,
      S: 3,
      A: 2,
      B: 1,
    };

    return [...heroes].sort((first, second) => {
      switch (sort) {
        case 'name-desc':
          return second.name.localeCompare(first.name);

        case 'tier-high':
          return (
            tierOrder[second.tier] - tierOrder[first.tier] || first.name.localeCompare(second.name)
          );

        case 'tier-low':
          return (
            tierOrder[first.tier] - tierOrder[second.tier] || first.name.localeCompare(second.name)
          );

        case 'name-asc':
        default:
          return first.name.localeCompare(second.name);
      }
    });
  }

  private createDefaultFilters(): HeroFilterState {
    return {
      search: '',
      faction: '',
      tier: '',
      type: '',
      sort: 'name-asc',
    };
  }

  private readFiltersFromQueryParams(): HeroFilterState {
    const queryParams = this.route.snapshot.queryParamMap;

    return {
      search: queryParams.get('search') ?? '',

      faction: (queryParams.get('faction') as HeroFilterState['faction']) ?? '',

      tier: (queryParams.get('tier') as HeroFilterState['tier']) ?? '',

      type: (queryParams.get('type') as HeroFilterState['type']) ?? '',

      sort: (queryParams.get('sort') as HeroSortOption) ?? 'name-asc',
    };
  }

  private updateQueryParams(filters: HeroFilterState): void {
    void this.router.navigate([], {
      relativeTo: this.route,

      queryParams: {
        search: filters.search || null,
        faction: filters.faction || null,
        tier: filters.tier || null,
        type: filters.type || null,

        sort: filters.sort !== 'name-asc' ? filters.sort : null,
      },

      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
