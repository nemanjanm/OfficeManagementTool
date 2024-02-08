import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from 'src/app/auth/services/storage.service';
import { Roles } from 'src/app/models/Roles';

export function AuthGuard(...roles: Roles[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const storageService = inject(StorageService);
    const jwtService = new JwtHelperService();
    var token = storageService.getToken();
    if(roles == null || roles.length == 0) {

      if(token != null) {
        return true;
      }

      router.navigate(["/login"]);
      return false;
    }

    if(roles.includes(Number(jwtService.decodeToken(storageService.getToken() as string).Role))) {
      return true;
    }

    router.navigate(["/forbidden"]);
    return false;
  }
}
