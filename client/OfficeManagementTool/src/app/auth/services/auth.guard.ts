import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { StorageService } from './storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Roles } from 'src/app/models/Roles';

export function AuthGuard(...roles: Roles[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const storageService = inject(StorageService);
    const jwtService = new JwtHelperService();
    var token = storageService.getToken();

    if(token == null) {
      router.navigate(["/login"]);
      return false;
    }

    if(roles == null || roles.length == 0) {
      return true;
    }

    if(roles.includes(Number(jwtService.decodeToken(token).role))) {
      return true;
    }

    router.navigate(["/forbidden"]);
    return false;
  }
}
