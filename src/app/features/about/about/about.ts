import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { GuideService } from '../../../core/services/guide.service';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  imports: [AsyncPipe, RouterLink, Panel, StatusMessage],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly guideService = inject(GuideService);

  readonly viewModel$ = this.guideService.getIntroduction().pipe(
    map((guide) => ({
      guide,
      error: false,
    })),

    catchError(() =>
      of({
        guide: undefined,
        error: true,
      }),
    ),
  );
}
