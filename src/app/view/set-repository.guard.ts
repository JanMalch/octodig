import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';
import { TreeService } from '../github/contents/tree.service';
import { StateService } from '../github/state.service';

@Injectable()
export class SetRepositoryGuard implements CanActivate {
  constructor(private state: StateService, private tree: TreeService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.state.set({ ...next.params });

    return this.tree.tree$.pipe(
      first(t => !!t && t.size > 0),
      mapTo(true)
    );
  }
}
