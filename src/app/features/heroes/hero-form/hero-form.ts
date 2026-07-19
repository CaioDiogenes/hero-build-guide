import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  HERO_FACTION_OPTIONS,
  HERO_TIER_OPTIONS,
  HERO_TYPE_OPTIONS,
} from '../../../core/constants/hero-options';
import { HeroFaction } from '../../../core/models/faction.model';
import { Hero, HeroTier, HeroType } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { TagListInput } from '../../../shared/components/tag-list-input/tag-list-input';

export type HeroDraft = Omit<Hero, 'id' | 'slug'>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-form',
  imports: [ReactiveFormsModule, TagListInput],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
})
export class HeroForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly heroService = inject(HeroService);

  readonly hero = input<Hero>();
  readonly submitLabel = input('Save changes');
  readonly saving = input(false);
  readonly submitHero = output<HeroDraft>();
  readonly cancelled = output<void>();

  readonly factionOptions = HERO_FACTION_OPTIONS;
  readonly tierOptions = HERO_TIER_OPTIONS;
  readonly typeOptions = HERO_TYPE_OPTIONS;

  // Suggested values for the closed-vocabulary fields — the game rarely
  // introduces genuinely new stigmata/collections/artifacts/gems, so these
  // are derived from every hero already in Firestore rather than hardcoded.
  readonly stigmaOptions = toSignal(
    this.heroService.getDistinctValues((hero) => [...hero.stigmataFourSet, ...hero.stigmataTwoSet]),
    { initialValue: [] },
  );
  readonly collectionOptions = toSignal(
    this.heroService.getDistinctValues((hero) => hero.collections),
    { initialValue: [] },
  );
  readonly artifactOptions = toSignal(
    this.heroService.getDistinctValues((hero) => hero.artifacts),
    {
      initialValue: [],
    },
  );
  readonly gemOptions = toSignal(
    this.heroService.getDistinctValues((hero) => hero.gems),
    {
      initialValue: [],
    },
  );

  readonly form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
    title: this.fb.control(''),
    faction: this.fb.control<HeroFaction | ''>('', { validators: [Validators.required] }),
    types: this.fb.control<HeroType[]>([]),
    tier: this.fb.control<HeroTier | ''>('', { validators: [Validators.required] }),
    minimumRelics: this.fb.control<number | null>(null),
    minimumExclusiveEquipment: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
    placement: this.fb.control(''),
    statFocus: this.fb.control<string[]>([]),
    stigmataFourSet: this.fb.control<string[]>([]),
    stigmataTwoSet: this.fb.control<string[]>([]),
    collections: this.fb.control<string[]>([]),
    artifacts: this.fb.control<string[]>([]),
    generalTalentsPvp: this.fb.control<string[]>([]),
    gems: this.fb.control<string[]>([]),
    gemTalents: this.fb.control<string[]>([]),
    notes: this.fb.control<string[]>([]),
  });

  private initializedSlug: string | undefined;

  constructor() {
    // hero() comes from a live Firestore listener, which can re-emit the same
    // document (e.g. cache-then-server snapshots) while the user is mid-edit.
    // Only (re)initialize the form when the hero identity actually changes, so
    // those re-emissions don't clobber in-progress, unsaved input.
    effect(() => {
      const hero = this.hero();

      if (!hero || hero.slug === this.initializedSlug) {
        return;
      }

      this.initializedSlug = hero.slug;

      this.form.setValue({
        name: hero.name,
        title: hero.title ?? '',
        faction: hero.faction,
        types: hero.types,
        tier: hero.tier,
        minimumRelics: hero.minimumRelics ?? null,
        minimumExclusiveEquipment: hero.minimumExclusiveEquipment,
        placement: hero.placement ?? '',
        statFocus: hero.statFocus,
        stigmataFourSet: hero.stigmataFourSet,
        stigmataTwoSet: hero.stigmataTwoSet,
        collections: hero.collections,
        artifacts: hero.artifacts,
        generalTalentsPvp: hero.generalTalentsPvp,
        gems: hero.gems,
        gemTalents: hero.gemTalents,
        notes: hero.notes ?? [],
      });
    });
  }

  get hasNoTypeSelected(): boolean {
    return this.form.controls.types.value.length === 0;
  }

  isTypeSelected(type: HeroType): boolean {
    return this.form.controls.types.value.includes(type);
  }

  toggleType(type: HeroType, checked: boolean): void {
    const current = this.form.controls.types.value;

    this.form.controls.types.setValue(
      checked ? [...current, type] : current.filter((value) => value !== type),
    );
  }

  onSubmit(): void {
    if (this.form.invalid || this.hasNoTypeSelected) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const draft: HeroDraft = {
      name: value.name.trim(),
      title: value.title.trim() || undefined,
      faction: value.faction as HeroFaction,
      types: value.types,
      tier: value.tier as HeroTier,
      minimumRelics: value.minimumRelics ?? undefined,
      minimumExclusiveEquipment: value.minimumExclusiveEquipment,
      placement: value.placement.trim() || undefined,
      statFocus: value.statFocus,
      stigmataFourSet: value.stigmataFourSet,
      stigmataTwoSet: value.stigmataTwoSet,
      collections: value.collections,
      artifacts: value.artifacts,
      generalTalentsPvp: value.generalTalentsPvp,
      gems: value.gems,
      gemTalents: value.gemTalents,
      notes: value.notes.length > 0 ? value.notes : undefined,
    };

    this.submitHero.emit(draft);
  }
}
