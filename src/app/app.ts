import { Component, signal } from '@angular/core';
import { AppShell } from './layout/app-shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShell],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('hero-build-guide');
}
