import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.serverUrl}/api/Auth`;

  constructor(private http: HttpClient) { }

  sendResetPasswordRequest(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${email}`, null);
  }
}