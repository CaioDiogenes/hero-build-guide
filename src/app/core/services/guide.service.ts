import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { shareReplay, Observable } from "rxjs";
import { GuideIntroduction, BeginnerTeamGuide, AHeroPveGuide, CrowdControlDotGuide, AcronymFaqGuide, GuideCredits } from "../models/guide.model";

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    private readonly http = inject(HttpClient);

    private readonly introduction$ = this.http
        .get<GuideIntroduction>(
            '/data/guide/introduction.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    private readonly beginnerTeamGuide$ = this.http
        .get<BeginnerTeamGuide>(
            '/data/guide/beginner-team-building.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    private readonly aHeroPveGuide$ = this.http
        .get<AHeroPveGuide>(
            '/data/guide/a-hero-pve.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    private readonly crowdControlDotGuide$ = this.http
        .get<CrowdControlDotGuide>(
            '/data/guide/cc-dot.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    private readonly acronymFaqGuide$ = this.http
        .get<AcronymFaqGuide>(
            '/data/guide/acronyms-faq.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    private readonly credits$ = this.http
        .get<GuideCredits>(
            '/data/guide/credits.json',
        )
        .pipe(
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

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
}