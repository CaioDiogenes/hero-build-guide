import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { map, catchError, of } from "rxjs";
import { GuideService } from "../../../core/services/guide.service";
import { PanelComponent } from "../../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../../shared/components/status-message/status-message";

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    PanelComponent,
    StatusMessageComponent,
  ],
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class Credits {
  private readonly guideService = inject(GuideService);

  readonly viewModel$ = this.guideService
    .getCredits()
    .pipe(
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