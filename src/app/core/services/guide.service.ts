import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import {
  GuideIntroduction,
  BeginnerTeamGuide,
  AHeroPveGuide,
  CrowdControlDotGuide,
  AcronymFaqGuide,
  GuideCredits,
  GuideNavigationData,
} from '../models/guide.model';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  private readonly http = inject(HttpClient);
  private readonly appPath = inject(AppPathService);

  private readonly introduction$ = this.load<GuideIntroduction>('data/guide/introduction.json');

  private readonly beginnerTeamGuide$ = this.load<BeginnerTeamGuide>(
    'data/guide/beginner-team-building.json',
  );

  private readonly aHeroPveGuide$ = this.load<AHeroPveGuide>('data/guide/a-hero-pve.json');

  private readonly crowdControlDotGuide$ =
    this.load<CrowdControlDotGuide>('data/guide/cc-dot.json');

  private readonly acronymFaqGuide$ = this.load<AcronymFaqGuide>('data/guide/acronyms-faq.json');

  private readonly credits$ = this.load<GuideCredits>('data/guide/credits.json');

  private readonly navigation$ = this.load<GuideNavigationData>('data/guide/navigation.json');

  getIntroduction(): Observable<GuideIntroduction> {
    return this.introduction$;
  }

  getBeginnerTeamGuide(): Observable<BeginnerTeamGuide> {
    return this.beginnerTeamGuide$;
  }

  getAHeroPveGuide(): Observable<AHeroPveGuide> {
    return this.aHeroPveGuide$;
  }

  getCrowdControlDotGuide(): Observable<CrowdControlDotGuide> {
    return this.crowdControlDotGuide$;
  }

  getAcronymFaqGuide(): Observable<AcronymFaqGuide> {
    return this.acronymFaqGuide$;
  }

  getCredits(): Observable<GuideCredits> {
    return this.credits$;
  }

  getNavigation(): Observable<GuideNavigationData> {
    return this.navigation$;
  }

  private load<T>(path: string): Observable<T> {
    return this.http.get<T>(this.appPath.getUrl(path)).pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );
  }
}
