import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {


  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem("auth_token");
    if (token && req.headers.get("Content-Type") == null) {
      const cloned = req.clone({
          headers: req.headers.set("x-access-token", token)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
