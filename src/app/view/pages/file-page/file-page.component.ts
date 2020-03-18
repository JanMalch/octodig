import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { ContentService } from '../../../github/contents/content.service';
import { ContentItem, DataLookupService } from '../../../github/contents/data-lookup.service';
import { Repository, StateService } from '../../../github/state.service';

declare var CodeMirror: any;

@UntilDestroy()
@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.scss']
})
export class FilePageComponent implements OnInit {
  activeSha: string;
  fileLoading$: Observable<boolean>;
  data$: Observable<{
    file: { renderer: string; ending?: string; mode?: any; value: string };
    info: ContentItem;
  }>;

  private readonly defaultMode = {
    name: 'plain',
    mimes: ['text/plain'],
    mode: 'null',
    alias: [],
    mime: 'text/plain'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: ContentService,
    private lookup: DataLookupService,
    private state: StateService,
    private title: Title
  ) {}

  ngOnInit() {
    this.activeSha = this.route.snapshot.paramMap.get('filePath');
    this.fileLoading$ = this.content.loadingFile$.pipe(untilDestroyed(this));
    this.data$ = this.route.paramMap.pipe(
      untilDestroyed(this),
      tap(() => this.content.loadingFile$.next(true)),
      mergeMap(params => {
        const filePath = params.get('filePath');
        if (!filePath) {
          return of({
            info: null,
            file: {
              renderer: null,
              ending: null,
              value: null
            }
          });
        }
        return this.content.findBySha(filePath).pipe(
          map(content => {
            const info = this.lookup.findByIdentifier(filePath);
            if (!info) {
              throw new Error('No info for file ' + filePath);
            }
            const repo = this.state.repository$.getValue();
            const file = this.getFileDescription(info, content, repo);
            this.title.setTitle(`${info.path} · ${repo.owner}/${repo.name}/${repo.branch} · octodig`);
            return { info, file };
          })
        );
      }),
      shareReplay(1),
      tap(() => this.content.loadingFile$.next(false))
    );
  }

  private getFileDescription(info: ContentItem, content: string, repo: Repository) {
    let renderer;
    let value = content;
    const detectedMode = CodeMirror.findModeByFileName(info.path) || this.defaultMode;
    if (detectedMode.mode === 'gfm' || detectedMode.mode === 'markdown') {
      renderer = 'marked';
    } else if (['jpg', 'png'].some(ending => info.path.endsWith(ending))) {
      renderer = 'image';
      value = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${info.path}`;
    } else if (['csv'].some(ending => info.path.endsWith(ending))) {
      renderer = 'table';
    } else {
      renderer = 'codemirror';
    }
    return {
      renderer,
      value,
      mode: detectedMode
    };
  }
}
