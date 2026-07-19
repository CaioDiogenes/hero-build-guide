import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { map, shareReplay, switchMap, take, Observable } from 'rxjs';
import { HeroFaction } from '../models/faction.model';
import { HeroNavigation } from '../models/hero-navigation.model';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly injector = inject(Injector);

  private readonly heroes$ = collectionData(collection(this.firestore, 'heroes')).pipe(
    map((heroes) => heroes as Hero[]),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHeroBySlug(slug: string): Observable<Hero | undefined> {
    return this.heroes$.pipe(map((heroes) => heroes.find((hero) => hero.slug === slug)));
  }

  getHeroesByFaction(faction: HeroFaction): Observable<Hero[]> {
    return this.heroes$.pipe(map((heroes) => heroes.filter((hero) => hero.faction === faction)));
  }

  getDistinctValues(selector: (hero: Hero) => string[]): Observable<string[]> {
    return this.heroes$.pipe(
      map((heroes) => {
        const values = new Set<string>();

        for (const hero of heroes) {
          for (const value of selector(hero)) {
            values.add(value);
          }
        }

        return [...values].sort((first, second) => first.localeCompare(second));
      }),
    );
  }

  getHeroNavigationBySlug(slug: string): Observable<HeroNavigation | undefined> {
    return this.heroes$.pipe(
      map((heroes) => {
        const sortedHeroes = [...heroes].sort((first, second) =>
          first.name.localeCompare(second.name),
        );

        const currentIndex = sortedHeroes.findIndex((hero) => hero.slug === slug);

        if (currentIndex === -1) {
          return undefined;
        }

        return {
          hero: sortedHeroes[currentIndex],

          previousHero: currentIndex > 0 ? sortedHeroes[currentIndex - 1] : undefined,

          nextHero:
            currentIndex < sortedHeroes.length - 1 ? sortedHeroes[currentIndex + 1] : undefined,
        };
      }),
    );
  }

  addHero(hero: Hero): Observable<void> {
    return this.heroes$.pipe(
      take(1),
      switchMap(async () => {
        await runInInjectionContext(this.injector, () =>
          setDoc(doc(this.firestore, 'heroes', hero.slug), stripUndefined(hero)),
        );
        await this.logEdit(hero.slug, undefined, hero);
      }),
    );
  }

  updateHero(slug: string, hero: Hero): Observable<void> {
    return this.getHeroBySlug(slug).pipe(
      take(1),
      switchMap(async (previousHero) => {
        await runInInjectionContext(this.injector, () =>
          setDoc(doc(this.firestore, 'heroes', slug), stripUndefined(hero)),
        );
        await this.logEdit(slug, previousHero, hero);
      }),
    );
  }

  private async logEdit(
    heroSlug: string,
    previousValue: Hero | undefined,
    newValue: Hero,
  ): Promise<void> {
    const editor = this.auth.currentUser;

    await runInInjectionContext(this.injector, () =>
      addDoc(collection(this.firestore, 'heroEdits'), {
        heroSlug,
        editorUid: editor?.uid ?? null,
        editorEmail: editor?.email ?? null,
        previousValue: previousValue ? stripUndefined(previousValue) : null,
        newValue: stripUndefined(newValue),
        timestamp: serverTimestamp(),
      }),
    );
  }
}

// Firestore rejects literal `undefined` field values — Hero's optional fields
// (title, placement, minimumRelics, notes) are built as `undefined` rather than
// omitted, so writes need this before hitting setDoc()/addDoc().
function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as Partial<T>;
}
