import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faction-details',
  imports: [],
  templateUrl: './faction-details.html',
  styleUrl: './faction-details.scss',
})
export class FactionDetails {
  private readonly route = inject(ActivatedRoute);

  readonly slug = this.route.snapshot.paramMap.get('slug');
}
