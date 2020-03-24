import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from '../material/material.module';
import {
  CodemirrorComponent,
  DragSizerComponent,
  FileFooterComponent,
  FileRendererComponent,
  OpenedFilesComponent,
  RateComponent,
  RateLimitReachedComponent,
  RepoTreeComponent,
  SwitchRendererDialogComponent,
  TopNavComponent
} from './components';
import { FilePageComponent, ViewPageComponent } from './pages';
import {
  DecodeURIComponentPipe,
  FormatBytesPipe,
  GithubLinkPipe,
  ItemInfoByShaPipe,
  MinsDiffPipe,
  OpenedFilesMaxWidthPipe,
  RawContentLinkPipe
} from './pipes';
import { ScrollRestorationService } from './scroll-restoration.service';

import { ViewRoutingModule } from './view-routing.module';

@NgModule({
  declarations: [
    ViewPageComponent,
    FileRendererComponent,
    RateComponent,
    RateLimitReachedComponent,
    DragSizerComponent,
    TopNavComponent,
    RepoTreeComponent,
    OpenedFilesComponent,
    CodemirrorComponent,
    OpenedFilesMaxWidthPipe,
    FileFooterComponent,
    FilePageComponent,
    FormatBytesPipe,
    GithubLinkPipe,
    RawContentLinkPipe,
    MinsDiffPipe,
    ItemInfoByShaPipe,
    SwitchRendererDialogComponent,
    DecodeURIComponentPipe
  ],
  imports: [CommonModule, ViewRoutingModule, FormsModule, MaterialModule, CodemirrorModule, MarkdownModule.forChild()],
  entryComponents: [RateLimitReachedComponent, SwitchRendererDialogComponent],
  providers: [ScrollRestorationService]
})
export class ViewModule {}
