import { Injectable } from '@angular/core';
import { StateService } from '../github/state.service';

export interface ScrollInfo {
  left: 0;
  top: 0;
}

@Injectable()
export class ScrollRestorationService {
  private lookup = new Map<string, ScrollInfo>();

  constructor(private state: StateService) {
    this.state.reset$.subscribe(() => this.lookup.clear());
  }

  getPosition(identifier: string): ScrollInfo {
    return this.lookup.get(identifier) || { left: 0, top: 0 };
  }

  save(identifier: string, lastScrollPosition: ScrollInfo) {
    this.lookup.set(identifier, lastScrollPosition);
  }
}
