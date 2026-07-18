import { Signal, signal } from '@angular/core';

export interface ImageFallback {
  readonly failed: Signal<boolean>;
  onError(): void;
  reset(): void;
}

export function createImageFallback(): ImageFallback {
  const failed = signal(false);

  return {
    failed,
    onError: () => failed.set(true),
    reset: () => failed.set(false),
  };
}
