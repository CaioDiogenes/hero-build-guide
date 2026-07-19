import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Hero } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { Modal } from '../../../shared/components/modal/modal';
import { HeroDraft, HeroForm } from '../hero-form/hero-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-edit',
  imports: [Modal, HeroForm],
  templateUrl: './hero-edit.html',
  styleUrl: './hero-edit.scss',
})
export class HeroEdit {
  private readonly heroService = inject(HeroService);

  readonly hero = input.required<Hero>();
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly saving = signal(false);
  readonly errorMessage = signal<string | undefined>(undefined);

  onSave(draft: HeroDraft): void {
    const hero = this.hero();

    this.saving.set(true);
    this.errorMessage.set(undefined);

    const updatedHero: Hero = { ...draft, id: hero.id, slug: hero.slug };

    this.heroService.updateHero(hero.slug, updatedHero).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },

      error: (error) => {
        console.error('updateHero failed:', error);
        this.saving.set(false);
        this.errorMessage.set('Failed to save changes. Please try again.');
      },
    });
  }
}
