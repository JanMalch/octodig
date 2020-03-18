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

/**
 *
 * @param bytes
 * @param decimals
 * @author https://stackoverflow.com/a/18650828
 */
export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
