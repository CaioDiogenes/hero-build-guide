import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  HERO_FACTION_OPTIONS,
  HERO_TIER_OPTIONS,
  HERO_TYPE_OPTIONS,
} from '../../../core/constants/hero-options';
import { HeroFilterState, HeroSortOption } from '../../../core/models/hero-filter.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './hero-filters.html',
  styleUrl: './hero-filters.scss',
})
export class HeroFilters implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly filters = input.required<HeroFilterState>();
  readonly filtersChanged = output<HeroFilterState>();
  readonly filtersCleared = output<void>();
  readonly factionOptions = HERO_FACTION_OPTIONS;
  readonly tierOptions = HERO_TIER_OPTIONS;
  readonly typeOptions = HERO_TYPE_OPTIONS;

  readonly form = new FormGroup({
    search: new FormControl('', {
      nonNullable: true,
    }),

    faction: new FormControl('', {
      nonNullable: true,
    }),

    tier: new FormControl('', {
      nonNullable: true,
    }),

    type: new FormControl('', {
      nonNullable: true,
    }),

    sort: new FormControl<HeroSortOption>('name-asc', {
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.form.setValue(filters, {
        emitEvent: false,
      });
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(
          (previous, current) => JSON.stringify(previous) === JSON.stringify(current),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.filtersChanged.emit({
          search: value.search ?? '',
          faction: value.faction as HeroFilterState['faction'],
          tier: value.tier as HeroFilterState['tier'],
          type: value.type as HeroFilterState['type'],
          sort: value.sort ?? 'name-asc',
        });
      });
  }

  clearFilters(): void {
    this.form.setValue({
      search: '',
      faction: '',
      tier: '',
      type: '',
      sort: 'name-asc',
    });
  }
}
