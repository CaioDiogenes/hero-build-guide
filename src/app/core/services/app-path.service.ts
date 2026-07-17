import {
  DOCUMENT,
  inject,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppPathService {
  private readonly document = inject(DOCUMENT);

  resolve(path: string): string {
    const normalizedPath =
      path.replace(/^\/+/, '');

    return new URL(
      normalizedPath,
      this.document.baseURI,
    ).toString();
  }
}