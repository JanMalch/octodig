import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StateService } from './github/state.service';
import { BASE_PATH } from './github/tokens';

@Injectable({
  providedIn: 'root'
})
export class NotFoundInterceptor implements HttpInterceptor {
  constructor(@Inject(BASE_PATH) private readonly bp: string, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.bp)) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 404) {
            // TODO: improve!
            this.router.navigateByUrl('/');
          }
        }
        return throwError(err);
      })
    );
  }
}
