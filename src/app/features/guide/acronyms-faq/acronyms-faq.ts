import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { map, catchError, of, startWith, combineLatest } from "rxjs";
import { GuideAcronym, GuideFaqEntry } from "../../../core/models/guide.model";
import { GuideService } from "../../../core/services/guide.service";
import { ChipComponent } from "../../../shared/components/chip/chip";
import { PanelComponent } from "../../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../../shared/components/status-message/status-message";

type AcronymCategory =
  | 'Role'
  | 'Combat'
  | 'Game mode'
  | 'Attack';

@Component({
  selector: 'app-acronyms-faq',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    ChipComponent,
    PanelComponent,
    StatusMessageComponent,
  ],
  templateUrl: './acronyms-faq.html',
  styleUrl: './acronyms-faq.scss',
})
export class AcronymsFaq {
  private readonly guideService = inject(GuideService);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly categoryControl =
    new FormControl<AcronymCategory | ''>('', {
      nonNullable: true,
    });

  readonly categoryOptions: AcronymCategory[] = [
    'Role',
    'Combat',
    'Game mode',
    'Attack',
  ];

  private readonly guideResult$ = this.guideService
    .getAcronymFaqGuide()
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

  private readonly search$ =
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.getRawValue()),
    );

  private readonly category$ =
    this.categoryControl.valueChanges.pipe(
      startWith(
        this.categoryControl.getRawValue(),
      ),
    );

  readonly viewModel$ = combineLatest([
    this.guideResult$,
    this.search$,
    this.category$,
  ]).pipe(
    map(([result, search, category]) => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const acronyms =
        result.guide?.acronyms.filter(
          (entry) =>
            this.matchesAcronym(
              entry,
              normalizedSearch,
              category,
            ),
        ) ?? [];

      const faq =
        result.guide?.faq.filter(
          (entry) =>
            this.matchesFaq(
              entry,
              normalizedSearch,
            ),
        ) ?? [];

      return {
        guide: result.guide,
        acronyms,
        faq,
        error: result.error,
      };
    }),
  );

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
  }

  private matchesAcronym(
    entry: GuideAcronym,
    search: string,
    category: AcronymCategory | '',
  ): boolean {
    const matchesCategory =
      !category || entry.category === category;

    if (!search) {
      return matchesCategory;
    }

    const searchableContent = [
      entry.term,
      entry.meaning,
      entry.description,
      entry.category,
    ]
      .join(' ')
      .toLowerCase();

    return (
      matchesCategory &&
      searchableContent.includes(search)
    );
  }

  private matchesFaq(
    entry: GuideFaqEntry,
    search: string,
  ): boolean {
    if (!search) {
      return true;
    }

    const searchableContent = [
      entry.question,
      ...entry.answer,
      ...(entry.relatedTerms ?? []),
    ]
      .join(' ')
      .toLowerCase();

    return searchableContent.includes(search);
  }
}