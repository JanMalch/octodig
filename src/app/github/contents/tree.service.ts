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
    const { id, isRoot, name, parentPath } = extractItemData(item);
    const knownAsParent = tree.get(item.path);
    if (knownAsParent != null) {
      tree.set(id, knownAsParent);
      tree.delete(item.path);
    }
    pathLookup.set(item.path, id);
    if (isRoot && !tree.has(id)) {
      tree.set(id, item.type === 'blob' ? undefined : []);
      rootItems.push(id);
      return { ...item, name: item.path };
    }
    const parentSha = pathLookup.get(parentPath);
    addToGroup(tree, parentSha != null ? parentSha : parentPath, id);
    return { ...item, name };
  });
  return { tree, collectableData, rootItems };
}

function extractItemData(item: TreeItem) {
  const id = fileId(item);
  const segments = item.path.split('/');
  const isRoot = segments.length === 1;
  const name = segments.pop(); // segments now contains parent path!
  const parentPath = segments.join('/');
  return {
    id,
    isRoot,
    name,
    parentPath
  };
}

/**
 * Adds the given value to an array associated with the given key.
 * @param map the map collecting all groups
 * @param key a group key
 * @param value a value for the group
 */
function addToGroup<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const result = map.get(key);
  if (!result) {
    map.set(key, [value]);
  } else {
    map.set(key, [...result, value]);
  }
}
