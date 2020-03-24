import { DOCUMENT } from '@angular/common';
import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'openedFilesMaxWidth'
})
export class OpenedFilesMaxWidthPipe implements PipeTransform {
  constructor(@Inject(DOCUMENT) private d: Document) {}

  transform(left: number): number {
    return this.d.documentElement.clientWidth - left - 138;
  }
}
