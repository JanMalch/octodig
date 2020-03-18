import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { BASE_PATH } from './tokens';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(BASE_PATH) private readonly bp: string, private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.bp)) {
      return next.handle(req);
    }

    return this.auth.token$.pipe(
      mergeMap(token => {
        if (!token) {
          return next.handle(req);
        }
        const clone = req.clone({
          setHeaders: {
            Authorization: `token ${token}`
          }
        });
        return next.handle(clone);
      })
    );
  }
}
