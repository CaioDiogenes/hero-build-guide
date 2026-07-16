import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { HeroService } from '../../../core/services/hero.service';

@Component({
  selector: 'app-hero-detail',
  imports: [
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.scss',
})
export class HeroDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly heroService = inject(HeroService);

  readonly hero$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),
    switchMap((slug) => this.heroService.getHeroBySlug(slug)),
  );
}
