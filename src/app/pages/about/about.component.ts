import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

declare var CodeMirror: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  readonly modeInfo: any[] = CodeMirror.modeInfo;
  readonly languages = this.modeInfo
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map(mode => this.getModeInfo(mode));

  version: string;

  constructor(private meta: Meta) {}

  ngOnInit() {
    this.version = this.meta.getTag('name="version"').content;
  }

  private getModeInfo(mode: { name: string; ext?: string[]; file?: RegExp }): { associations: string; name: string } {
    const associations = [...(mode.ext || []).map(ext => '.' + ext), mode.file].filter(Boolean).join(', ');
    return { name: mode.name, associations };
  }
}
