import { Injectable, inject } from '@angular/core';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class StigmaImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(stigmaName: string): string {
    return this.appPath.getUrl(`data/assets/stigmas/${this.toSlug(stigmaName)}.webp`);
  }

  private toSlug(stigmaName: string): string {
    return stigmaName
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
