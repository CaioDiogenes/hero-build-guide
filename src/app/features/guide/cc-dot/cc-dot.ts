import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { map, catchError, of, startWith, combineLatest } from 'rxjs';
import {
  ControlRestriction,
  CrowdControlEffect,
  DotEffect,
} from '../../../core/models/guide.model';
import { GuideService } from '../../../core/services/guide.service';
import { Chip } from '../../../shared/components/chip/chip';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cc-dot',
  imports: [AsyncPipe, ReactiveFormsModule, Chip, Panel, StatusMessage],
  templateUrl: './cc-dot.html',
  styleUrl: './cc-dot.scss',
})
export class CcDot {
  private readonly guideService = inject(GuideService);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly restrictionControl = new FormControl<ControlRestriction | ''>('', {
    nonNullable: true,
  });

  readonly restrictionOptions: ControlRestriction[] = [
    'Basic',
    'Ultimate',
    'Basic and Ultimate',
    'Other',
  ];

  private readonly guideResult$ = this.guideService.getCrowdControlDotGuide().pipe(
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

  private readonly search$ = this.searchControl.valueChanges.pipe(
    startWith(this.searchControl.getRawValue()),
  );

  private readonly restriction$ = this.restrictionControl.valueChanges.pipe(
    startWith(this.restrictionControl.getRawValue()),
  );

  readonly viewModel$ = combineLatest([this.guideResult$, this.search$, this.restriction$]).pipe(
    map(([result, search, restriction]) => {
      const normalizedSearch = search.trim().toLowerCase();

      const crowdControl =
        result.guide?.crowdControl.filter((effect) =>
          this.matchesCrowdControl(effect, normalizedSearch, restriction),
        ) ?? [];

      const damageOverTime =
        result.guide?.damageOverTime.filter((effect) =>
          this.matchesDot(effect, normalizedSearch),
        ) ?? [];

      return {
        guide: result.guide,
        crowdControl,
        damageOverTime,
        error: result.error,
      };
    }),
  );

  clearFilters(): void {
    this.searchControl.setValue('');
    this.restrictionControl.setValue('');
  }

  private matchesCrowdControl(
    effect: CrowdControlEffect,
    search: string,
    restriction: ControlRestriction | '',
  ): boolean {
    const matchesRestriction = !restriction || effect.restriction === restriction;

    if (!search) {
      return matchesRestriction;
    }

    const searchableContent = [
      effect.name,
      effect.description,
      effect.restriction,
      ...(effect.additionalEffects ?? []),
    ]
      .join(' ')
      .toLowerCase();

    return matchesRestriction && searchableContent.includes(search);
  }

  private matchesDot(effect: DotEffect, search: string): boolean {
    if (!search) {
      return true;
    }

    const searchableContent = [effect.name, effect.source, effect.timing, ...(effect.notes ?? [])]
      .join(' ')
      .toLowerCase();

    return searchableContent.includes(search);
  }
}
