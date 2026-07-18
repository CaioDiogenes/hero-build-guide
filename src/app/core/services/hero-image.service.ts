import { Injectable, inject, DOCUMENT } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class HeroImageService {
    private readonly document = inject(DOCUMENT);

    getImageUrl(slug: string): string {
        return new URL(
            `data/assets/heroes/${slug}.webp`,
            this.document.baseURI,
        ).toString();
    }
}