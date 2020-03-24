import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { TreeService } from '../../../github/contents/tree.service';
import { StateService } from '../../../github/state.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPageComponent implements OnInit {
  width = 300;

  rootItems$: Observable<string[]>;
  tree$: Observable<Map<string, string[]> | null>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );
  repo$ = this.state.repository$;

  @ViewChild('drawer', { static: true }) drawer: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver, private state: StateService, private tree: TreeService) {
    this.tree$ = this.tree.tree$;
    this.rootItems$ = this.tree.rootItems$;
  }

  ngOnInit(): void {}

  autoWidth() {
    const treeWidth = document.querySelector('app-repo-tree > .mat-tree').clientWidth;
    this.width = treeWidth + 16;
    // TODO: implement autowidth
    // const topBtnWidth = document.querySelector('nav > mat-toolbar > a > span').clientWidth;
    // this.width = Math.max(treeWidth, topBtnWidth) + 16;
  }

  closeOnMobile() {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.drawer.close();
      }
    });
  }
}
