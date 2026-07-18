import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  readonly variant = input<BadgeVariant>('default');
}
