import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FileItem } from '../../../github/contents/data-lookup.service';

@Component({
  selector: 'app-file-footer[info]',
  templateUrl: './file-footer.component.html',
  styleUrls: ['./file-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileFooterComponent implements OnInit {
  @Input() info: FileItem;

  constructor() {}

  ngOnInit() {}
}
