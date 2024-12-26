import { JwtTokenService } from './jwt-token.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private jwtTokenService: JwtTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/login')) {
      return next.handle(request);
    }

    if (request.url.includes('/refreshToken')) {
      const refreshToken = this.jwtTokenService.getRefresh_token();

    if (refreshToken) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${refreshToken}`,
        }
      });
    }
    }

    const token = this.jwtTokenService.getAccess_token();

    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
        }
      });
    }

    return next.handle(request);
  }
}
