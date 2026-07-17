import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { BehaviorSubject, map, catchError, of, combineLatest, startWith } from "rxjs";
import { AHeroPveFilterState } from "../../../core/models/a-hero-pve-filter.model";
import { AHeroUtility, AHeroPveEntry } from "../../../core/models/guide.model";
import { GuideService } from "../../../core/services/guide.service";
import { ChipComponent } from "../../../shared/components/chip/chip";
import { PanelComponent } from "../../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../../shared/components/status-message/status-message";

@Component({
  selector: 'app-a-hero-pve',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    ChipComponent,
    PanelComponent,
    StatusMessageComponent,
  ],
  templateUrl: './a-hero-pve.html',
  styleUrl: './a-hero-pve.scss',
})
export class AHeroPve {
  private readonly guideService = inject(GuideService);

  readonly utilityOptions: AHeroUtility[] = [
    'Healing',
    'Healing Reduction',
    'Attack Buff',
    'Armor Buff',
    'Speed Buff',
    'Damage Reduction',
    'Energy Drain',
    'Stun',
    'Freeze',
    'Crowd Control',
  ];

  readonly filterForm = new FormGroup({
    search: new FormControl('', {
      nonNullable: true,
    }),
    utility: new FormControl<AHeroUtility | ''>('', {
      nonNullable: true,
    }),
  });

  private readonly filtersSubject =
    new BehaviorSubject<AHeroPveFilterState>({
      search: '',
      utility: '',
    });

  readonly filters$ = this.filterForm.valueChanges.pipe(
    startWith(null),
    map(() => this.filterForm.getRawValue()),
  );

  readonly guideResult$ = this.guideService
    .getAHeroPveGuide()
    .pipe(
      map((guide) => ({
        guide,
        error: false,
      })),

      catchError(() =>
        of({
          guide: undefined,
          error: true,
        }),
      ),
    );

  readonly viewModel$ = combineLatest([
    this.guideResult$,
    this.filters$,
  ]).pipe(
    map(([result, filters]) => {
      const normalizedSearch =
        filters.search.trim().toLowerCase();

      const heroes =
        result.guide?.heroes.filter(
          (hero) =>
            this.matchesSearch(
              hero,
              normalizedSearch,
            ) &&
            this.matchesUtility(
              hero,
              filters.utility,
            ),
        ) ?? [];

      return {
        guide: result.guide,
        heroes,
        totalHeroes:
          result.guide?.heroes.length ?? 0,
        error: result.error,
      };
    }),
  );

  clearFilters(): void {
    this.filterForm.setValue({
      search: '',
      utility: '',
    });
  }

  private matchesSearch(
    hero: AHeroPveEntry,
    search: string,
  ): boolean {
    if (!search) {
      return true;
    }

    return (
      hero.name.toLowerCase().includes(search) ||
      hero.description.toLowerCase().includes(search) ||
      hero.utilities.some((utility) =>
        utility.toLowerCase().includes(search),
      )
    );
  }

  private matchesUtility(
    hero: AHeroPveEntry,
    utility: AHeroUtility | '',
  ): boolean {
    return (
      !utility ||
      hero.utilities.includes(utility)
    );
  }
}