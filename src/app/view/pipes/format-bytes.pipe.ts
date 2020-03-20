import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBytes'
})
export class FormatBytesPipe implements PipeTransform {
  readonly sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  readonly k = 1024;

  /**
   * Transforms the given bytes in a human readable string.
   * @param bytes the byte count
   * @param decimals desired decimal places
   * @author https://stackoverflow.com/a/18650828
   */
  transform(bytes: number, decimals: number = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(this.k));
    return parseFloat((bytes / Math.pow(this.k, i)).toFixed(dm)) + ' ' + this.sizes[i];
  }
}
