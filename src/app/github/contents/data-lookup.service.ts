import { coerceArray } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { ViewModule } from '../../view/view.module';
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

export interface DirItem extends ContentItem {
  type: 'tree';
  // TODO: what else?
}

export function isFileItem(value: any): value is FileItem {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  return value.type === 'file';
}

export function isDirItem(value: any): value is DirItem {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  return value.type === 'dir';
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
    coerceArray(value).forEach(v => {
      if (v.hasOwnProperty('sha')) {
        this.add(v);
      }
    });
  }
}
