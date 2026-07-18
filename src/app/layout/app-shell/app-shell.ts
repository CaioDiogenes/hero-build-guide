import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { MobileNavigation } from '../mobile-navigation/mobile-navigation';
import { Sidebar } from '../sidebar/sidebar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Footer, Header, MobileNavigation, Sidebar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  mobileMenuOpen = false;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.closeMobileMenu();
      });
  }

  openMobileMenu(): void {
    this.mobileMenuOpen = true;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
