import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { take } from 'rxjs';
import { toSlug } from '../../../core/utils/slug.util';
import { Hero } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { Modal } from '../../../shared/components/modal/modal';
import { HeroDraft, HeroForm } from '../hero-form/hero-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-add',
  imports: [Modal, HeroForm],
  templateUrl: './hero-add.html',
  styleUrl: './hero-add.scss',
})
export class HeroAdd {
  private readonly heroService = inject(HeroService);

  readonly created = output<string>();
  readonly cancelled = output<void>();

  readonly saving = signal(false);
  readonly errorMessage = signal<string | undefined>(undefined);

  onSave(draft: HeroDraft): void {
    const slug = toSlug(draft.name);

    if (!slug) {
      this.errorMessage.set('Enter a valid name to generate a hero slug.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(undefined);

    this.heroService
      .getHeroes()
      .pipe(take(1))
      .subscribe((heroes) => {
        if (heroes.some((hero) => hero.slug === slug)) {
          this.saving.set(false);
          this.errorMessage.set(
            `A hero with the slug "${slug}" already exists. Choose a different name.`,
          );
          return;
        }

        const hero: Hero = { ...draft, id: slug, slug };

        this.heroService.addHero(hero).subscribe({
          next: () => {
            this.saving.set(false);
            this.created.emit(slug);
          },

          error: (error) => {
            console.error('addHero failed:', error);
            this.saving.set(false);
            this.errorMessage.set('Failed to add hero. Please try again.');
          },
        });
      });
  }
}
