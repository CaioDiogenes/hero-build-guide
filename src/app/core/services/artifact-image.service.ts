import { Injectable, inject } from '@angular/core';
import artifactIcons from '../constants/artifact-icons.json';
import { toSlug } from '../utils/slug.util';
import { AppPathService } from './app-path.service';

@Injectable({
  providedIn: 'root',
})
export class ArtifactImageService {
  private readonly appPath = inject(AppPathService);

  getImageUrl(artifactName: string): string | undefined {
    const filename = (artifactIcons as Record<string, string>)[toSlug(artifactName)];

    return filename ? this.appPath.getUrl(`data/assets/artifacts/${filename}`) : undefined;
  }
}
