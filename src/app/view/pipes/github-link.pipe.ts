import { Pipe, PipeTransform } from '@angular/core';
import { ContentItem } from '../../github/contents/data-lookup.service';
import { StateService } from '../../github/state.service';

@Pipe({
  name: 'githubLink'
})
export class GithubLinkPipe implements PipeTransform {
  constructor(private state: StateService) {}

  transform(value: ContentItem): string {
    const repo = this.state.repository$.getValue();
    return `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch}/${value.path}`;
  }
}
