import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { GuideService } from '../../../core/services/guide.service';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-credits',
  imports: [AsyncPipe, RouterLink, Panel, StatusMessage],
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class Credits {
  private readonly guideService = inject(GuideService);

  readonly viewModel$ = this.guideService.getCredits().pipe(
    map((credits) => ({
      credits,
      error: false,
    })),

    catchError(() =>
      of({
        credits: undefined,
        error: true,
      }),
    ),
  );
}
