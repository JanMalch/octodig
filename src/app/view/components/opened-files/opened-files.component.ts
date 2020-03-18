import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { ContentService } from '../../../github/contents/content.service';
import { StateService } from '../../../github/state.service';

@Component({
  selector: 'app-opened-files',
  templateUrl: './opened-files.component.html',
  styleUrls: ['./opened-files.component.scss']
})
export class OpenedFilesComponent implements OnInit {
  files: string[] = [];
  baseLink: string;

  constructor(private state: StateService, private router: Router, public content: ContentService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.state.repository$.subscribe(repo => {
      if (repo === null) {
        this.files = [];
        return;
      }
      this.baseLink = `/v/${repo.owner}/${repo.name}/${repo.branch}/`;
    });
    this.router.events
      .pipe(
        filter(ev => ev instanceof NavigationEnd),
        filter((ev: NavigationEnd) => ev.urlAfterRedirects.startsWith('/v/')),
        startWith({ urlAfterRedirects: this.router.url }),
        map(({ urlAfterRedirects }: NavigationEnd) => urlAfterRedirects.split('/').pop()),
        map(decodeURIComponent)
      )
      .subscribe(filePath => {
        if (!filePath) {
          this.files = [];
          return;
        }
        if (!this.files.includes(filePath)) {
          this.files = [...this.files, filePath];
        }
      });
  }

  close(filePath: string) {
    const currentPath = decodeURIComponent(this.router.url.split('/').pop());
    let nextPath;
    if (filePath !== currentPath) {
      nextPath = currentPath;
    } else if (this.files.length === 1) {
      nextPath = '';
    } else {
      const index = this.files.indexOf(filePath);
      switch (index) {
        case 0:
          nextPath = this.files[1];
          break;
        case this.files.length - 1:
          nextPath = this.files[index - 1];
          break;
        default:
          nextPath = this.files[index + 1];
          break;
      }
    }
    this.files = this.files.filter(fs => fs !== filePath);
    this.router.navigateByUrl(this.baseLink + nextPath);
  }

  closeAll() {
    this.files = [];
    this.router.navigateByUrl(this.baseLink);
  }
}
