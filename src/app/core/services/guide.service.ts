import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { GuideIntroduction } from '../models/guide.model';

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

    getIntroduction(): Observable<GuideIntroduction> {
        return this.introduction$;
    }
}