import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

import { Hero } from '../models/hero.model';
import { HeroFaction } from '../models/faction.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);

  private readonly dataUrl = '/data/heroes.json';

  private readonly heroes$ = this.http
    .get<Hero[]>(this.dataUrl)
    .pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHeroBySlug(slug: string): Observable<Hero | undefined> {
    return this.heroes$.pipe(
      map((heroes) =>
        heroes.find((hero) => hero.slug === slug),
      ),
    );
  }

  getHeroesByFaction(faction: HeroFaction): Observable<Hero[]> {
    return this.heroes$.pipe(
      map((heroes) =>
        heroes.filter((hero) => hero.faction === faction),
      ),
    );
  }
}