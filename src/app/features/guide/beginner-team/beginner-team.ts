import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { map, catchError, of } from "rxjs";
import { GuideService } from "../../../core/services/guide.service";
import { PanelComponent } from "../../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../../shared/components/status-message/status-message";

@Component({
  selector: 'app-beginner-team',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    PanelComponent,
    StatusMessageComponent,
  ],
  templateUrl: './beginner-team.html',
  styleUrl: './beginner-team.scss',
})
export class BeginnerTeam {
  private readonly guideService = inject(GuideService);

  readonly viewModel$ = this.guideService
    .getBeginnerTeamGuide()
    .pipe(
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