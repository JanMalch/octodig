import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, mergeMap, tap } from 'rxjs/operators';
import { ViewModule } from '../../view/view.module';
import { StateService } from '../state.service';
import { BASE_PATH } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  loadingFile$ = new BehaviorSubject<boolean>(false);
  private readonly lookup = new Map<string, string>();

  constructor(private http: HttpClient, private state: StateService, @Inject(BASE_PATH) private readonly bp: string) {
    this.state.reset$.subscribe(() => this.lookup.clear());
  }

  findByPath(path: string): Observable<string> {
    const existing = this.lookup.get(path);
    if (!existing) {
      return this.state.repository$.pipe(
        first(x => x != null),
        mergeMap(repo =>
          this.http.get<string>(`${this.bp}repos/${repo.owner}/${repo.name}/contents/${path}`, {
            responseType: 'text' as 'json',
            params: {
              ref: decodeURIComponent(repo.branch)
            },
            headers: {
              Accept: 'application/vnd.github.VERSION.raw'
            }
          })
        ),
        tap(c => this.lookup.set(path, c))
      );
    }
    return of(existing);
  }
}
