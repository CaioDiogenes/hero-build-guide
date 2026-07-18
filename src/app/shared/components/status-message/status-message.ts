import { Component, input } from '@angular/core';

export type StatusMessageType = 'loading' | 'empty' | 'error';

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.html',
  styleUrl: './status-message.scss',
})
export class StatusMessage {
  readonly type = input<StatusMessageType>('empty');
  readonly title = input.required<string>();
  readonly message = input<string>();
}
