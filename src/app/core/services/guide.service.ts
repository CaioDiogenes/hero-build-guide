import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { shareReplay, Observable } from "rxjs";
import { GuideIntroduction, BeginnerTeamGuide } from "../models/guide.model";

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

    getIntroduction(): Observable<GuideIntroduction> {
        return this.introduction$;
    }

    getBeginnerTeamGuide(): Observable<BeginnerTeamGuide> {
        return this.beginnerTeamGuide$;
    }
}