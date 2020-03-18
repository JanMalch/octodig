import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minsDiff'
})
export class MinsDiffPipe implements PipeTransform {
  transform(target: number): number {
    const now = Date.now();
    return Math.ceil((target - now) / 1000 / 60);
  }
}
