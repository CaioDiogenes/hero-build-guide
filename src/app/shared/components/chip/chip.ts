import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { createImageFallback } from '../../../core/utils/image-fallback';

export const DEFAULT_ICON_SIZE = 32;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
})
export class Chip {
  readonly icon = input<string>();
  readonly iconSize = input<number>(DEFAULT_ICON_SIZE);
  readonly fallback = createImageFallback();
}
