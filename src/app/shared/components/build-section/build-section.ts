import { Component, input } from '@angular/core';
import { Chip } from '../chip/chip';

@Component({
  selector: 'app-build-section',
  imports: [Chip],
  templateUrl: './build-section.html',
  styleUrl: './build-section.scss',
})
export class BuildSection {
  readonly title = input.required<string>();
  readonly items = input.required<string[]>();
  readonly emptyMessage = input<string>('No recommendations');
}
