import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { RateLimitReachedComponent } from '../../view/components/rate-limit-reached/rate-limit-reached.component';
import { BASE_PATH } from '../tokens';
import { RateResponse, RateState } from './models';

@Injectable()
export class RateService {
  private readonly icons = [
    'battery-outline',
    'battery-10',
    'battery-20',
    'battery-30',
    'battery-40',
    'battery-50',
    'battery-60',
    'battery-70',
    'battery-80',
    'battery-90',
    'battery'
  ];

  readonly rate$ = new BehaviorSubject<RateState>({
    remaining: -1,
    limit: 60,
    reset: Math.floor((Date.now() + 60 * 60 * 1000) / 1000),
    icon: 'battery-outline'
  });

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(@Inject(BASE_PATH) private readonly bp: string, private http: HttpClient, private dialog: MatDialog, zone: NgZone) {
    this.refresh$
      .pipe(
        throttleTime(3000),
        switchMap(() => this.http.get<RateResponse>(`${this.bp}rate_limit`))
      )
      .subscribe(res => {
        this._next(res.resources.core);
        if (res.resources.core.remaining === 0) {
          zone.run(() => {
            // TODO: move to error handler?
            this.dialog.open(RateLimitReachedComponent, {
              data: this.rate$.getValue(),
              maxWidth: '95vw',
              width: '480px'
            });
          });
        }
      });
  }

  private _next(state: Partial<RateState>) {
    const now = {
      ...this.rate$.getValue(),
      ...state
    };
    const percentage = Math.ceil((10 * now.remaining) / now.limit);
    this.rate$.next({
      ...now,
      icon: this.icons[percentage]
    });
  }

  decrement(by: number = 1) {
    this._next({
      remaining: this.rate$.getValue().remaining - by
    });
  }

  refresh() {
    this.refresh$.next();
  }
}
