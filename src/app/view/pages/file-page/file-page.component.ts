import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, Subject } from 'rxjs';
import { map, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ContentService } from '../../../github/contents/content.service';
import { ContentItem, DataLookupService } from '../../../github/contents/data-lookup.service';
import { Repository, StateService } from '../../../github/state.service';
import { Renderer, RendererType } from '../../models';

declare var CodeMirror: any;

interface FilePageState {
  item: ContentItem | null;
  renderer: Renderer;
  content: string | null;
}

const emptyState: FilePageState = {
  item: null,
  renderer: { type: null, name: null },
  content: null
};

function determineName(type: RendererType, detectedMode?: any): string | null {
  switch (type) {
    case 'codemirror':
      return detectedMode.name;
    case 'image':
      return 'Image';
    case 'table':
      return 'Table';
    case 'marked':
      return 'Markdown (rendered)';
    default:
      return null;
  }
}

function determineRenderer(path: string): Renderer {
  const detectedMode = CodeMirror.findModeByFileName(path);
  let type: RendererType = null;
  if (detectedMode.mode === 'gfm' || detectedMode.mode === 'markdown') {
    type = 'marked';
  } else if (['jpg', 'png'].some(ending => path.endsWith(ending))) {
    type = 'image';
  } else if (['csv'].some(ending => path.endsWith(ending))) {
    type = 'table';
  } else {
    type = 'codemirror';
  }
  return { type, mode: detectedMode, name: determineName(type, detectedMode) };
}

function updateContentForRenderer(renderer: Renderer, content: string | null, path: string, repo: Repository): string | null {
  if (renderer.type === 'image') {
    return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${path}`;
  }
  return content;
}

function getContentItem(paramMap: ParamMap, lookup: DataLookupService): ContentItem | null {
  const filePath = paramMap.get('filePath');
  if (!filePath) {
    return null;
  }
  const item = lookup.findByIdentifier(filePath);
  if (!item) {
    throw new Error('No info for file ' + filePath);
  }
  return item;
}

@UntilDestroy()
@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.scss']
})
export class FilePageComponent implements OnInit {
  fileLoading$: Observable<boolean>;
  state$: Observable<FilePageState>;
  renderer$ = new Subject<Renderer>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: ContentService,
    private lookup: DataLookupService,
    private state: StateService,
    private title: Title
  ) {}

  ngOnInit() {
    this.fileLoading$ = this.content.loadingFile$.pipe(untilDestroyed(this));

    const data$ = this.route.paramMap.pipe(
      untilDestroyed(this),
      tap(() => this.content.loadingFile$.next(true)),
      switchMap(params => {
        const item = getContentItem(params, this.lookup);
        if (item == null) {
          return of(emptyState);
        }
        return this.content.findByPath(item.path).pipe(map(content => ({ item, content })));
      }),
      map(({ item, content }) => {
        if (item == null) {
          return emptyState;
        }
        const repo = this.state.repository$.getValue();
        this.title.setTitle(`${item.path} · ${repo.owner}/${repo.name}/${repo.branch} · octodig`);

        const renderer = determineRenderer(item.path);
        const updatedContent = updateContentForRenderer(renderer, content, item.path, repo);
        return { item, renderer, content: updatedContent };
      }),
      tap(state => {
        this.content.loadingFile$.next(false);
        this.renderer$.next(state.renderer);
      }),
      shareReplay(1)
    );

    this.state$ = data$.pipe(
      mergeMap(data =>
        this.renderer$.pipe(
          startWith(data.renderer),
          map(renderer => ({ ...data, renderer }))
        )
      )
    );
  }
}
