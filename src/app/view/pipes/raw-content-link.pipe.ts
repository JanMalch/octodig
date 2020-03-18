import { Pipe, PipeTransform } from '@angular/core';
import { ContentItem } from '../../github/contents/data-lookup.service';
import { StateService } from '../../github/state.service';

@Pipe({
  name: 'rawContentLink'
})
export class RawContentLinkPipe implements PipeTransform {
  constructor(private state: StateService) {}

  transform(value: ContentItem): string {
    const repo = this.state.repository$.getValue();
    return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${value.path}`;
  }
}
