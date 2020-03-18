import { Injectable } from '@angular/core';
import { Comparators } from 'comparing';
import { Observable } from 'rxjs';
import { map, pluck, shareReplay, tap } from 'rxjs/operators';
import { StateService } from '../state.service';
import { ApiService, TreeItem } from './api.service';
import { DataLookupService } from './data-lookup.service';
import { fileId } from './functions';

@Injectable({
  providedIn: 'root' // necessary for redirect guard, TODO: refactor possible/needed?
})
export class TreeService {
  comparator = Comparators.with<TreeItem, 'blob' | 'tree'>(i => i.type, Comparators.ofOrder(['tree', 'blob'])).then((a, b) =>
    a.path.localeCompare(b.path)
  );
  openingRequests: string[] = [];

  tree$: Observable<Map<string, string[]>>;
  rootItems$: Observable<string[]>;

  constructor(private lookup: DataLookupService, private apiService: ApiService, private state: StateService) {
    const treeified$: Observable<TreeifyResult> = this.apiService.initialDir$.pipe(
      map(items => {
        if (items === null) {
          return {
            collectableData: null,
            tree: new Map(),
            rootItems: []
          };
        }
        return treeify(items.sort(this.comparator));
      }),
      tap(result => this.lookup.collect(result.collectableData)),
      shareReplay(1)
    );
    this.tree$ = treeified$.pipe(pluck('tree'));
    this.rootItems$ = treeified$.pipe(pluck('rootItems'));
  }

  open(path: string) {
    this.openingRequests.push(path);
  }
}

interface TreeifyResult {
  tree: Map<string, string[]>;
  rootItems: string[];
  collectableData: Array<TreeItem & { name: string }>;
}

function treeify(items: TreeItem[]): TreeifyResult {
  const tree = new Map<string, string[]>();
  const pathLookup = new Map<string, string>();
  const rootItems: string[] = [];
  const collectableData = items.map(item => {
    const knownAsParent = tree.get(item.path);
    if (knownAsParent) {
      tree.set(fileId(item), knownAsParent);
      tree.delete(item.path);
    }
    pathLookup.set(item.path, fileId(item));
    const segments = item.path.split('/');
    const rootItem = segments.length === 1;
    if (rootItem && !tree.has(fileId(item))) {
      tree.set(fileId(item), item.type === 'blob' ? undefined : []);
      rootItems.push(fileId(item));
      return { ...item, name: item.path };
    }
    const name = segments.pop(); // segments now contains parent path!
    const parentPath = segments.join('/');
    const parentSha = pathLookup.get(parentPath);
    if (!parentSha) {
      const result = tree.get(parentPath);
      if (!result) {
        tree.set(parentPath, [fileId(item)]);
      } else {
        tree.set(parentPath, [...result, fileId(item)]);
      }
    } else {
      const result = tree.get(parentSha);
      if (!result) {
        tree.set(parentSha, [fileId(item)]);
      } else {
        tree.set(parentSha, [...result, fileId(item)]);
      }
    }
    return { ...item, name };
  });
  return { tree, collectableData, rootItems };
}
