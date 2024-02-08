import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, tap } from 'rxjs/operators'
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor{

  constructor(
    private auth: AuthService,
    private storageService: StorageService, 
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.storageService.getToken();

    if(authToken != null){
      req = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + authToken)
      });
    }

    return next.handle(req).pipe(
      catchError((event: any) => {
        if( event instanceof HttpErrorResponse ) {
          if(event.status == 401){
            this.auth.logout();
            this.router.navigate(["login"]);
          }
          else if(event.status == 403){
            this.router.navigate(["forbidden"]);
          }
        }
        return throwError(() => event);
    }))
  }
}
