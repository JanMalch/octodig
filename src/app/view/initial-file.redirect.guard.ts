import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, map, pluck, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../github/contents/api.service';
import { DataLookupService } from '../github/contents/data-lookup.service';
import { TreeService } from '../github/contents/tree.service';

@Injectable()
export class InitialFileRedirectGuard implements CanActivate {
  constructor(private tree: TreeService, private api: ApiService, private lookup: DataLookupService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree> {
    const readmePath$ = this.api.readme$.pipe(
      first(x => x != null),
      tap(x => this.lookup.collect(x)),
      pluck('path'),
      map(encodeURIComponent)
    );
    let initialPath$ = readmePath$;
    const pathParam = next.queryParamMap.get('path');
    if (!!pathParam) {
      // from OpenRedirectGuard
      initialPath$ = this.tree.tree$.pipe(
        first(x => !!x && x.size > 0),
        switchMap(() => {
          const encodedPath = encodeURIComponent(pathParam);
          const info = this.lookup.findByIdentifier(encodedPath);
          return info.type === 'blob' ? of(encodedPath) : readmePath$;
        })
      );
    }
    return initialPath$.pipe(map(path => this.router.createUrlTree(['/v', next.params.owner, next.params.name, next.params.branch, path])));
  }
}
