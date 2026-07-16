import { Component, signal } from '@angular/core';
import { AppShellComponent } from './layout/app-shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [
    AppShellComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hero-build-guide');
}
