import { Injectable, inject } from '@angular/core';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(collectionName: string): string {
    return this.appPath.getUrl(`data/assets/collections/${this.toSlug(collectionName)}.webp`);
  }

  private toSlug(collectionName: string): string {
    return collectionName
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
