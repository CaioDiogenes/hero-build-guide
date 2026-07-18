import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { GuideNavigationItem } from '../../../core/models/guide.model';
import { GuideService } from '../../../core/services/guide.service';
import { Panel } from '../../../shared/components/panel/panel';
import { StatusMessage } from '../../../shared/components/status-message/status-message';

@Component({
  selector: 'app-guide-index',
  imports: [AsyncPipe, RouterLink, Panel, StatusMessage],
  templateUrl: './guide-index.html',
  styleUrl: './guide-index.scss',
})
export class GuideIndex {
  private readonly guideService = inject(GuideService);

  readonly viewModel$ = this.guideService.getNavigation().pipe(
    map((navigation) => {
      const sortedItems = [...navigation.items].sort((first, second) => first.order - second.order);

      return {
        navigation,
        gettingStarted: this.getItemsByCategory(sortedItems, 'Getting started'),
        reference: this.getItemsByCategory(sortedItems, 'Reference'),
        about: this.getItemsByCategory(sortedItems, 'About'),
        error: false,
      };
    }),

    catchError(() =>
      of({
        navigation: undefined,
        gettingStarted: [],
        reference: [],
        about: [],
        error: true,
      }),
    ),
  );

  private getItemsByCategory(
    items: GuideNavigationItem[],
    category: GuideNavigationItem['category'],
  ): GuideNavigationItem[] {
    return items.filter((item) => item.category === category);
  }
}
