import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth, GoogleAuthProvider, authState, signInWithPopup, signOut } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { catchError, map, of, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  // authState() only emits once Firebase has determined the real signed-in/out
  // state — never a synthetic "not signed in yet" value — so anything derived
  // from it (isEditor$, the authGuard) can safely take(1) without a false
  // "not an editor" reading during rehydration on a fresh page load.
  readonly currentUser$ = authState(this.auth).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  // A user can edit/add heroes only if they have a doc at /editors/{uid} — see
  // firestore.rules and scripts/manage-editors.mjs. Being signed in alone is
  // not enough.
  readonly isEditor$ = this.currentUser$.pipe(
    switchMap((user) =>
      user
        ? runInInjectionContext(this.injector, () =>
            docData(doc(this.firestore, 'editors', user.uid)),
          ).pipe(
            map((editorDoc) => editorDoc !== undefined),
            catchError(() => of(false)),
          )
        : of(false),
    ),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  async signInWithGoogle(): Promise<void> {
    await runInInjectionContext(this.injector, () =>
      signInWithPopup(this.auth, new GoogleAuthProvider()),
    );
  }

  async signOut(): Promise<void> {
    await runInInjectionContext(this.injector, () => signOut(this.auth));
  }
}
