import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Repository {
  owner: string;
  name: string;
  branch?: string;
}

// TODO: put to use
export function routerLinkOfRepo(repository: Repository): string {
  return `/v/${repository.owner}/${repository.name}/${repository.branch}`;
}

export function areEqualsRepos(a: Repository, b: Repository): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  repository$ = new BehaviorSubject<Repository | null>(null);
  reset$: Observable<null> = this.repository$.pipe(
    filter(repo => repo === null) // TODO: distinct until changed?
  ) as Observable<null>;

  set(next: Partial<Repository> | null) {
    if (next === null) {
      this.repository$.next(null);
      return;
    }
    const now = this.repository$.getValue();
    const normalized = {
      owner: next.owner || now.owner,
      name: next.name || now.name,
      branch: next.branch || now.branch || 'master'
    };
    if (areEqualsRepos(normalized, now)) {
      return;
    }
    this.repository$.next(normalized);
  }
}
