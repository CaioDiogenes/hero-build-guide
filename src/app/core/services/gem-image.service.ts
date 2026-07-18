import { Injectable, inject } from '@angular/core';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class GemImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(gemName: string): string {
    return this.appPath.getUrl(`data/assets/gems/${this.toSlug(gemName)}.webp`);
  }

  private toSlug(gemName: string): string {
    return gemName
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
