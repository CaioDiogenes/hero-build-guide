import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { forkJoin, map, shareReplay, Observable } from "rxjs";
import { HeroFaction } from "../models/faction.model";
import { HeroNavigation } from "../models/hero-navigation";
import { Hero } from "../models/hero.model";

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);

  private readonly dataUrls = [
    '/data/heroes/superman.json',
    '/data/heroes/technology.json',
    '/data/heroes/dark.json',
    '/data/heroes/nature.json',
    '/data/heroes/god.json',
    '/data/heroes/universe.json',
  ];

  private readonly heroes$ = forkJoin(
    this.dataUrls.map((url) =>
      this.http.get<Hero[]>(url),
    ),
  ).pipe(
    map((factionHeroes) =>
      factionHeroes.flat(),
    ),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHeroBySlug(
    slug: string,
  ): Observable<Hero | undefined> {
    return this.heroes$.pipe(
      map((heroes) =>
        heroes.find(
          (hero) => hero.slug === slug,
        ),
      ),
    );
  }

  getHeroesByFaction(
    faction: HeroFaction,
  ): Observable<Hero[]> {
    return this.heroes$.pipe(
      map((heroes) =>
        heroes.filter(
          (hero) => hero.faction === faction,
        ),
      ),
    );
  }

  getHeroNavigationBySlug(
    slug: string,
  ): Observable<HeroNavigation | undefined> {
    return this.heroes$.pipe(
      map((heroes) => {
        const sortedHeroes = [...heroes].sort(
          (first, second) =>
            first.name.localeCompare(second.name),
        );

        const currentIndex =
          sortedHeroes.findIndex(
            (hero) => hero.slug === slug,
          );

        if (currentIndex === -1) {
          return undefined;
        }

        return {
          hero: sortedHeroes[currentIndex],
          previousHero:
            currentIndex > 0
              ? sortedHeroes[currentIndex - 1]
              : undefined,
          nextHero:
            currentIndex <
            sortedHeroes.length - 1
              ? sortedHeroes[currentIndex + 1]
              : undefined,
        };
      }),
    );
  }
}