import { Component, input } from '@angular/core';

export type StatusMessageType =
  | 'loading'
  | 'empty'
  | 'error';

@Component({
  selector: 'app-status-message',
  standalone: true,
  templateUrl: './status-message.html',
  styleUrl: './status-message.scss',
})
export class StatusMessageComponent {
  readonly type = input<StatusMessageType>('empty');
  readonly title = input.required<string>();
  readonly message = input<string>();
}