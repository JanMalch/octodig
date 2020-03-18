import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BASE_PATH } from '../tokens';

@Injectable()
export class RateInterceptor implements HttpInterceptor {
  constructor(@Inject(BASE_PATH) private readonly bp: string) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.bp)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403 && err.error && err.error.message && err.error.message.startsWith('API rate limit exceeded')) {
            return of(null);
          }
        }
        return throwError(err);
      })
    );
    /*if (!req.url.startsWith(this.bp) || req.url === `${this.bp}rate_limit`) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      tap(() => this.rateService.decrement())
    );*/
  }
}
