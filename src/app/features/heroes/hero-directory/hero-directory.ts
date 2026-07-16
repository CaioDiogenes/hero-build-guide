import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../../core/services/hero.service';

@Component({
  selector: 'app-hero-directory',
  imports: [
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './hero-directory.html',
  styleUrl: './hero-directory.scss',
})
export class HeroDirectory {
  private readonly heroService = inject(HeroService);

  readonly heroes$ = this.heroService.getHeroes();
}
