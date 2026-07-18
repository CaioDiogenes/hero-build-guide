import { Injectable, inject } from '@angular/core';
import { toSlug } from '../utils/slug.util';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(collectionName: string): string {
    return this.appPath.getUrl(`data/assets/collections/${toSlug(collectionName)}.webp`);
  }
}
