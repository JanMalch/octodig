import { Pipe, PipeTransform } from '@angular/core';
import { ContentItem, DataLookupService } from '../../github/contents/data-lookup.service';

@Pipe({
  name: 'itemInfoBySha'
})
export class ItemInfoByShaPipe implements PipeTransform {
  constructor(private lookup: DataLookupService) {}

  transform(filePath: string, field: keyof ContentItem = 'name'): string {
    const result = this.lookup.findByIdentifier(filePath);
    if (!result) {
      return '<?>';
    }
    return result[field];
  }
}
