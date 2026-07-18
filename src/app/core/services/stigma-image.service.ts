import { Injectable, inject } from '@angular/core';
import { toSlug } from '../utils/slug.util';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class StigmaImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(stigmaName: string): string {
    return this.appPath.getUrl(`data/assets/stigmas/${toSlug(stigmaName)}.webp`);
  }
}
