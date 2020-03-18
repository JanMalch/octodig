import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction
} from '@angular/core';
import { Router } from '@angular/router';
import { DataLookupService } from '../../../github/contents/data-lookup.service';
import { TreeService } from '../../../github/contents/tree.service';
import { Repository } from '../../../github/state.service';
import { DynamicDatabase, DynamicDataSource, DynamicFlatNode } from './tree-control';

// tslint:disable:variable-name
// tslint:disable:member-ordering

@Component({
  selector: 'app-repo-tree[tree][rootItems][repo]',
  templateUrl: './repo-tree.component.html',
  styleUrls: ['./repo-tree.component.scss'],
  providers: [DynamicDatabase],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoTreeComponent implements OnInit, OnChanges {
  @Input() tree: Map<string, string[]>;
  @Input() rootItems: string[];

  @Input() set repo(value: Repository) {
    this.repoLinkPrefix = `/v/${value.owner}/${value.name}/${value.branch}/`;
  }

  @Output() selectFile = new EventEmitter<DynamicFlatNode>();

  repoLinkPrefix: string;

  constructor(
    private database: DynamicDatabase,
    private lookup: DataLookupService,
    private treeService: TreeService,
    private router: Router
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.tree && !!changes.rootItems) {
      this.database.dataMap = this.tree;
      this.database.rootLevelNodes = this.rootItems;
      this.dataSource.data = this.database.initialData();

      if (this.treeControl.dataNodes.length > 0) {
        Promise.resolve().then(() => {
          this.treeService.openingRequests.forEach(path => {
            const identifier = encodeURIComponent(path);
            const found = this.treeControl.dataNodes.find(node => node.item === identifier);
            console.log(path, ':', found);
            if (found.expandable) {
              this.treeControl.expand(found);
            } else {
              const [, , owner, name, branch] = this.router.url.split('/');
              this.router.navigateByUrl(`/v/${owner}/${name}/${branch}/${path}`);
            }
          });
          this.treeService.openingRequests = [];
        });
      }
    }
  }

  trackBy: TrackByFunction<DynamicFlatNode> = (index, item) => {
    return item.item;
  };
}
