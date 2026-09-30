import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { View } from '@nativescript/core';
import { deviceLanguage, formatAppVersion } from '../core/app-info';

/** The tagline follows the device language; these are the only strings on this screen. */
function getSplashTexts(): { tagline: string; skipHint: string } {
  return deviceLanguage() === 'fr'
    ? { tagline: 'Gestion de cotisation', skipHint: 'Touchez pour continuer' }
    : { tagline: 'Cotisation manager', skipHint: 'Tap to continue' };
}

/**
 * Floor on how long the splash is visible. A splash that flashes for 80ms looks like a bug, so the
 * brand mark always gets a readable beat. When real bootstrap work exists (loading the saved group,
 * members and current cycle), await it and keep this floor so the screen never flickers.
 */
const SPLASH_MIN_MS = 1800;

/** Where the splash hands over to once the app is usable. */
const ENTRY_ROUTE: string[] = ['/items'];

@Component({
  selector: 'ns-splash',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class SplashScreenComponent implements AfterViewInit, OnDestroy {
  private routerExtensions = inject(RouterExtensions);

  @ViewChild('brand') brandRef?: ElementRef<View>;
  @ViewChild('footer') footerRef?: ElementRef<View>;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;
  private left = false;

  private readonly texts = getSplashTexts();

  readonly versionLabel = formatAppVersion();
  readonly tagline = this.texts.tagline;
  readonly skipHint = this.texts.skipHint;

  ngAfterViewInit(): void {
    this.reveal(this.brandRef?.nativeElement);
    this.reveal(this.footerRef?.nativeElement, 260);
    this.timer = setTimeout(() => this.dismiss(), SPLASH_MIN_MS);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clearTimer();
  }

  /** Tapping anywhere skips the remainder of the hold. */
  dismiss(): void {
    if (this.destroyed || this.left) {
      return;
    }
    this.left = true;
    this.clearTimer();

    // clearHistory: the splash must not be reachable again with the hardware back button.
    this.routerExtensions.navigate(ENTRY_ROUTE, {
      transition: { name: 'fade', duration: 260 },
      clearHistory: true,
    });
  }

  private reveal(target: View | undefined, delayMs = 0): void {
    if (!target || typeof target.animate !== 'function') {
      return;
    }

    target.opacity = 0;
    target.translateY = 16;

    const run = () => {
      if (this.destroyed) {
        return;
      }
      target
        .animate({ opacity: 1, translateY: 0, duration: 420, curve: 'easeOut' })
        .catch(() => this.settle(target));
    };

    if (delayMs > 0) {
      setTimeout(run, delayMs);
    } else {
      run();
    }
  }

  /** Fallback if the animation is interrupted - the content must never be left invisible. */
  private settle(target: View): void {
    target.opacity = 1;
    target.translateY = 0;
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
