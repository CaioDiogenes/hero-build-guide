import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Hero } from '../models/hero.model';
import { HeroFaction } from '../models/faction.model';
import { HeroNavigation } from '../models/hero-navigation';

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

    getHeroNavigationBySlug(
        slug: string,
    ): Observable<HeroNavigation | undefined> {
        return this.heroes$.pipe(
            map((heroes) => {
                const sortedHeroes = [...heroes].sort((first, second) =>
                    first.name.localeCompare(second.name),
                );

                const currentIndex = sortedHeroes.findIndex(
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
                        currentIndex < sortedHeroes.length - 1
                            ? sortedHeroes[currentIndex + 1]
                            : undefined,
                };
            }),
        );
    }
}