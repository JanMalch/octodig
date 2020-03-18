import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';
import { Repository, StateService } from '../../../github/state.service';

@Component({
  selector: 'app-top-nav[drawer][isHandset]',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @Input() drawer: MatSidenav;
  @Input() isHandset: boolean;

  repo$: Observable<Repository>;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private state: StateService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.user$.pipe(map(Boolean));
    this.repo$ = this.state.repository$;
  }

  login() {
    this.authService.login().subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
