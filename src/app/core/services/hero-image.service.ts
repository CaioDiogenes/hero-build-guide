import { Injectable, inject } from '@angular/core';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class HeroImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(slug: string): string {
    return this.appPath.getUrl(`data/assets/heroes/${slug}.webp`);
  }
}
