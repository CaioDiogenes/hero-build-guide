import { HttpClient } from "@angular/common/http";
import { Injectable, inject, DOCUMENT } from "@angular/core";
import { forkJoin, map, shareReplay, Observable } from "rxjs";
import { HeroFaction } from "../models/faction.model";
import { HeroNavigation } from "../models/hero-navigation";
import { Hero } from "../models/hero.model";

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  private readonly dataFiles = [
    'superman.json',
    'technology.json',
    'dark.json',
    'nature.json',
    'god.json',
    'universe.json',
  ] as const;

  private readonly heroes$ = forkJoin(
    this.dataFiles.map((file) =>
      this.http.get<Hero[]>(
        this.resolveUrl(
          `data/heroes/${file}`,
        ),
      ),
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
          (hero) =>
            hero.faction === faction,
        ),
      ),
    );
  }

  getHeroNavigationBySlug(
    slug: string,
  ): Observable<
    HeroNavigation | undefined
  > {
    return this.heroes$.pipe(
      map((heroes) => {
        const sortedHeroes = [
          ...heroes,
        ].sort(
          (first, second) =>
            first.name.localeCompare(
              second.name,
            ),
        );

        const currentIndex =
          sortedHeroes.findIndex(
            (hero) =>
              hero.slug === slug,
          );

        if (currentIndex === -1) {
          return undefined;
        }

        return {
          hero: sortedHeroes[currentIndex],

          previousHero:
            currentIndex > 0
              ? sortedHeroes[
              currentIndex - 1
              ]
              : undefined,

          nextHero:
            currentIndex <
              sortedHeroes.length - 1
              ? sortedHeroes[
              currentIndex + 1
              ]
              : undefined,
        };
      }),
    );
  }

  private resolveUrl(
    path: string,
  ): string {
    return new URL(
      path.replace(/^\/+/, ''),
      this.document.baseURI,
    ).toString();
  }
}