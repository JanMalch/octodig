import { coerceArray } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { StateService } from '../state.service';
import { fileId } from './functions';

export interface ContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url;
  // type: 'file' | 'dir';
  type: 'blob' | 'tree';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface FileItem extends ContentItem {
  type: 'blob';
  encoding: 'base64' | string; // TODO: what else?
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {
  private encodedPathLookup = new Map<string, ContentItem>();

  constructor(private state: StateService) {
    this.state.reset$.subscribe(() => {
      this.encodedPathLookup.clear();
    });
  }

  findByIdentifier(identifier: string): ContentItem | undefined {
    if (!identifier) {
      throw new Error(`Can't look for invalid identifier '${identifier}'`);
    }
    return this.encodedPathLookup.get(identifier);
  }

  add(item: ContentItem | any) {
    if (item.hasOwnProperty('path')) {
      this.encodedPathLookup.set(fileId(item), item);
    }
  }

  collect(value: any) {
    if (!value) {
      return;
    }
    coerceArray(value).forEach(v => this.add(v));
  }
}
