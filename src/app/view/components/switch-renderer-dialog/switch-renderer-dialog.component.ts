import { AfterViewInit, Component, Inject, TrackByFunction, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { Renderer } from '../../models';

declare var CodeMirror: any;

interface RendererWithIcon extends Renderer {
  icon?: string;
}

@Component({
  selector: 'app-switch-renderer-dialog',
  templateUrl: './switch-renderer-dialog.component.html',
  styleUrls: ['./switch-renderer-dialog.component.scss']
})
export class SwitchRendererDialogComponent implements AfterViewInit {
  private readonly allOptions = [
    { icon: 'language-markdown', type: 'marked', name: 'Markdown (rendered)' },
    { icon: 'image', type: 'image', name: 'Image' },
    { icon: 'table', type: 'table', name: 'Table' },
    ...CodeMirror.modeInfo
      .map(mode => ({ type: 'codemirror', name: mode.name, mode }))
      .sort((a, b) => a.mode.name.toLowerCase().localeCompare(b.mode.name.toLowerCase()))
  ];

  readonly options$ = new BehaviorSubject<RendererWithIcon[]>(this.allOptions);

  readonly trackByFn: TrackByFunction<RendererWithIcon> = (index, item) => `${item.type}_${item.name}`;

  @ViewChild('modes') selectionList: MatSelectionList;

  constructor(
    @Inject(MAT_DIALOG_DATA) private currentRenderer: Renderer,
    private matDialogRef: MatDialogRef<SwitchRendererDialogComponent, Renderer>
  ) {}

  ngAfterViewInit(): void {
    const rendererId = (renderer: Renderer) => `${renderer.type}_${renderer.type == 'codemirror' ? renderer.mode.name : 'null'}`;
    const currentId = rendererId(this.currentRenderer);
    const selected = this.selectionList.options.toArray().find(option => currentId === rendererId(option.value));
    Promise.resolve().then(() => {
      this.selectionList.selectedOptions.select(selected);
      selected._getHostElement().scrollIntoView();
    });
  }

  onQueryChange(value: string) {
    const query = value.trim().toLowerCase();
    const filtered = this.allOptions.filter(opt => opt.name.toLowerCase().includes(query));
    this.options$.next(filtered);
  }

  onSelect(value: Renderer) {
    this.matDialogRef.close(value);
  }
}
