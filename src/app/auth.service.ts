import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, first, mergeMap, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  token$ = new StorageSubject('token');

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.user.pipe(shareReplay(1));
  }

  login(extended: boolean = false) {
    const provider = new auth.GithubAuthProvider();
    if (extended) {
      provider.addScope('repo');
    }
    return from(this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL)).pipe(
      mergeMap(() => this.afAuth.auth.signInWithPopup(provider)),
      tap(res => {
        this.token$.next((res.credential as any).accessToken);
      })
    );
  }

  logout() {
    this.token$.next(null);
    return from(this.afAuth.auth.signOut());
  }

  private _attemptDelete(): Observable<void> {
    return this.afAuth.authState.pipe(
      first(user => !!user),
      mergeMap(user => user.delete())
    );
  }

  delete(): Observable<void> {
    return this._attemptDelete().pipe(
      catchError(err => {
        if (err.code === 'auth/requires-recent-login') {
          return this.login().pipe(mergeMap(() => this._attemptDelete()));
        }
        return throwError(err);
      })
    );
  }
}

export class StorageSubject extends BehaviorSubject<string | null> {
  constructor(public readonly key: string, public readonly storage: Storage = sessionStorage) {
    super(storage.getItem(key) || null);
  }

  next(value: string | null): void {
    super.next(value);
    this.storage.setItem(this.key, value);
  }
}
