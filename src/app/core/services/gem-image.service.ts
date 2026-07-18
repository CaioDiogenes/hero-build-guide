import { Injectable, inject } from '@angular/core';
import { toSlug } from '../utils/slug.util';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class GemImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(gemName: string): string {
    return this.appPath.getUrl(`data/assets/gems/${toSlug(gemName)}.webp`);
  }
}
