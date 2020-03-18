import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TreeService } from './github/contents/tree.service';

@Injectable()
export class OpenRedirectGuard implements CanActivate {
  constructor(private router: Router, private tree: TreeService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree> {
    const [, owner, name, type, branch, ...remainder] = next.queryParamMap.get('url').split('/');
    const arr = [];
    console.log('remainder:', remainder);
    for (const segment of remainder) {
      arr.push(segment);
      this.tree.open(arr.join('/'));
    }
    return of(
      this.router.createUrlTree(['/v/', owner, name, branch || 'master'], {
        queryParams: {
          path: arr.join('/')
        }
      })
    );
  }
}
