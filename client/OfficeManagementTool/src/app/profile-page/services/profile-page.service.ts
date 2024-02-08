import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { UserInfo } from 'src/app/models/UserInfo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilePageService {
  private apiUrl: string = "api/user";

  constructor(private http: HttpClient) { }

  public refreshRequired = new Subject<void>();

  changeName(id: number,firstname: string, lastname: string, email: string, officeId:number, role: number): Observable<ActionResultResponse> {
    return this.http
    .put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}/name`, {id, firstname, lastname, email, role, officeId})
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }

  changePassword(user: UserInfo, newPassword: string, oldPassword: string): Observable<ActionResultResponse> {
    var id = user.id;
    return this.http
    .put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}/password`, {id, newPassword, oldPassword})
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }
}
