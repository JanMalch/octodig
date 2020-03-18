import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { StateService } from '../state.service';
import { BASE_PATH } from '../tokens';
import { DataLookupService, FileItem } from './data-lookup.service';

export interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
}

export interface TreeResponse {
  sha: string;
  url: string;
  tree: TreeItem[];
  truncated: boolean;
}

/**
 * Calls the given `project` function, when the emitted value is not `null`.
 * Otherwise it will return `of(null)`.
 * @param project the mapper function
 */
export const mergeMapNonNull = <T, O>(
  project: (value: NonNullable<T>) => Observable<O>
): ((source$: Observable<T>) => Observable<null | O>) => (source$: Observable<T>) =>
  source$.pipe(
    mergeMap((value: NonNullable<T>) => {
      if (value === null) {
        return of(null);
      }
      return project(value);
    })
  );

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readme$: Observable<FileItem | null>;
  repoInfo$: Observable<any | null>; // TODO: typisieren
  branchInfo$: Observable<any | null>; // TODO: typisieren
  initialDir$: Observable<TreeItem[] | null>;

  constructor(
    private state: StateService,
    private dataLookup: DataLookupService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(BASE_PATH) private bp: string
  ) {
    this.repoInfo$ = this.state.repository$.pipe(
      mergeMapNonNull(repo =>
        this.http.get<any>(`${this.bp}repos/${repo.owner}/${repo.name}`, {
          params: {
            ref: repo.branch || 'master'
          }
        })
      ),
      shareReplay(1)
    );

    this.readme$ = this.state.repository$.pipe(
      mergeMapNonNull(repo =>
        this.http.get<FileItem>(`${this.bp}repos/${repo.owner}/${repo.name}/readme`, {
          params: {
            ref: repo.branch || 'master'
          }
        })
      ),
      tap(data => this.dataLookup.collect(data)),
      shareReplay(1)
    );

    this.branchInfo$ = this.state.repository$.pipe(
      mergeMapNonNull(repo => this.http.get<any>(`${this.bp}repos/${repo.owner}/${repo.name}/branches/${repo.branch}`)),
      tap(data => this.dataLookup.collect(data)),
      shareReplay(1)
    );

    this.initialDir$ = this.branchInfo$.pipe(
      mergeMapNonNull(branch => {
        const repo = this.state.repository$.getValue();
        return this.http.get<TreeResponse>(`${this.bp}repos/${repo.owner}/${repo.name}/git/trees/${branch.commit.commit.tree.sha}`, {
          params: {
            recursive: '1'
          }
        });
      }),
      tap(res => {
        if (res && res.truncated) {
          this.snackBar.open(
            'The GitHub API is unable to provide the full repository tree.' + ' Please open an issue on the octodig repository.',
            undefined,
            {
              duration: 8000
            }
          );
        }
      }),
      map(res => (!!res ? res.tree : null)),
      tap(data => this.dataLookup.collect(data)),
      shareReplay(1)
    );
  }
}
