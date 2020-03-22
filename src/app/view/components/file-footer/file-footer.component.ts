import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileItem } from '../../../github/contents/data-lookup.service';
import { StateService } from '../../../github/state.service';
import { Renderer } from '../../models';
import { SwitchRendererDialogComponent } from '../switch-renderer-dialog/switch-renderer-dialog.component';

@Component({
  selector: 'app-file-footer[info]',
  templateUrl: './file-footer.component.html',
  styleUrls: ['./file-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileFooterComponent implements OnInit {
  @Input() info: FileItem;
  @Input() renderer: Renderer;
  @Output() rendererChange = new EventEmitter<Renderer>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  isShareSupported = !!(navigator as any).share;

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private state: StateService) {}

  ngOnInit() {}

  switchLanguage() {
    const ref: MatDialogRef<SwitchRendererDialogComponent, Renderer> = this.dialog.open(SwitchRendererDialogComponent, {
      width: '1000px',
      height: '90vh',
      maxWidth: '90vw',
      maxHeight: '1000px',
      panelClass: 'p-0',
      data: this.renderer
    });
    ref.afterClosed().subscribe(res => {
      if (res != null) {
        this.rendererChange.emit(res);
      }
    });
  }

  share() {
    const repo = this.state.repository$.getValue();
    if (this.isShareSupported) {
      (navigator as any).share({
        title: `${this.info.name} on octodig`,
        text: `Checkout ${this.info.name} from ${repo.owner}/${repo.name} on octodig.`,
        url: location.href
      });
    } else {
      navigator.clipboard.writeText(location.href);
    }
  }
}
