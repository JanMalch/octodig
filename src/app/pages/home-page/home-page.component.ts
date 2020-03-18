import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { StateService } from '../../github/state.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('350ms', style({ opacity: 0 }))])
    ])
  ]
})
export class HomePageComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private state: StateService,
    private title: Title,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.state.set(null); // TODO: sinnvoll?
    this.isLoggedIn$ = this.auth.user$.pipe(map(Boolean), startWith(true));
    this.title.setTitle('octodig');
  }

  login() {
    this.auth.login().subscribe();
  }

  deleteUser($event: MouseEvent) {
    $event.preventDefault();
    this.auth.delete().subscribe({
      next: () => window.open('https://github.com/settings/applications'),
      error: err => {
        console.error(err);
        this.snackBar
          .open('An error has occurred. Please open a GitHub issue', 'OPEN')
          .onAction()
          .subscribe(() => {
            window.open('http://github.com/JanMalch/octodig/issues/new', '_blank');
          });
      }
    });
  }
}
