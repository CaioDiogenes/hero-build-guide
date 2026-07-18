import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Chip, DEFAULT_ICON_SIZE } from '../chip/chip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-build-section',
  imports: [Chip],
  templateUrl: './build-section.html',
  styleUrl: './build-section.scss',
})
export class BuildSection {
  readonly title = input.required<string>();
  readonly items = input.required<string[]>();
  readonly emptyMessage = input<string>('No recommendations');
  readonly iconFor = input<(item: string) => string | undefined>();
  readonly iconSize = input<number>(DEFAULT_ICON_SIZE);
}
