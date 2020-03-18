import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationStart, Router } from '@angular/router';
// import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MarkdownComponent } from 'ngx-markdown';
import { ContentService } from '../../../github/contents/content.service';
import { DataLookupService } from '../../../github/contents/data-lookup.service';
import { StateService } from '../../../github/state.service';
import { ScrollRestorationService } from '../../scroll-restoration.service';
import { CodemirrorComponent } from '../codemirror/codemirror.component';

declare var CodeMirror: any;

// tslint:disable:variable-name

@UntilDestroy()
@Component({
  selector: 'app-file-renderer',
  templateUrl: './file-renderer.component.html',
  styleUrls: ['./file-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileRendererComponent implements AfterViewInit {
  @Input()
  get mode(): any {
    return this._mode;
  }

  set mode(value: any) {
    this._mode = value;
    if (!value || !this.cmRef) {
      return;
    }
    if (value.mode !== 'null') {
      CodeMirror.autoLoadMode(this.cmRef.codeMirror, value.mode);
      // this.cmRef.codeMirrorGlobal.autoLoadMode(this.cmRef.codeMirror, detectedMode.mode);
    }
    this.cmRef.codeMirror.setOption('mode', value.mime);
  }

  private _mode: any;

  @Input() value: string | null;
  @Input() renderer: null | 'codemirror' | 'marked' | 'image' | 'table';

  readonly options = {
    lineNumbers: true,
    theme: 'darcula',
    readOnly: true, // 'nocursor',
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    matchBrackets: true,
    matchTags: true,
    highlightSelectionMatches: true,
    styleActiveLine: true
  };

  activeFilePath: string;

  @ViewChild(CodemirrorComponent) cmRef: CodemirrorComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: ContentService,
    private lookup: DataLookupService,
    private state: StateService,
    private title: Title,
    private elRef: ElementRef<HTMLElement>,
    private scroll: ScrollRestorationService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.activeFilePath = this.route.snapshot.paramMap.get('fileSha');
    this.router.events.pipe(untilDestroyed(this)).subscribe(ev => this.saveScrollPosition(ev));
    this.mode = this.mode; // trigger setting cmRef options
  }

  private saveScrollPosition(ev: Event) {
    if (ev instanceof NavigationStart) {
      const { left, top } = this.cmRef.codeMirror.getScrollInfo();
      this.scroll.save(this.activeFilePath, { left, top });
    }
  }

  codemirrorChanged() {
    this.ngZone.runOutsideAngular(() => {
      const filePath = this.route.snapshot.paramMap.get('filePath');
      if (this.activeFilePath === filePath) {
        return;
      }
      const { left, top } = this.scroll.getPosition(filePath);
      this.cmRef.codeMirror.scrollTo(left, top);
      this.activeFilePath = filePath;
    });
  }

  onMarkdownReady(md: MarkdownComponent) {
    const codeBlocks = md.element.nativeElement.querySelectorAll('pre');
    if (codeBlocks.length === 0) {
      return;
    }

    let remaining = codeBlocks.length;
    const highlightAll = () => {
      remaining--;
      if (remaining === 0) {
        CodeMirror.colorize(codeBlocks);
      }
    };
    codeBlocks.forEach(node => {
      CodeMirror.requireMode(node.getAttribute('data-lang'), highlightAll);
    });
  }
}
