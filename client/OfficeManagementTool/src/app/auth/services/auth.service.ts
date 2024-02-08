import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionResultResponse } from '../../models/ActionResultResponse';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  login(email: any, password: any): Observable<ActionResultResponse> {
    return this.http.post<ActionResultResponse>(environment.serverUrl + "/api/Auth/login", {
      email: email,
      password: password
    })
  }

  logout(): void {
    this.storageService.deleteCredentials();
  }

  isLoggedIn(): boolean {
    return this.storageService.getToken() != null;
  }
}
