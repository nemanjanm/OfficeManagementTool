import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionResultResponse } from 'src/app/shared/models/action-result-response';
import { ChangePassword } from 'src/app/shared/models/change-password';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  apiUrl = `${environment.serverUrl}/api/Auth/`
  constructor(private http: HttpClient) { }

  public sendEmail(mail: string) : Observable<ActionResultResponse>
  {
    return this.http.post<ActionResultResponse>(this.apiUrl + mail, null);
  }

  public changePassword(forSend: ChangePassword) : Observable<ActionResultResponse>
  {
    return this.http.post<ActionResultResponse>(`${this.apiUrl}change-password`, forSend);
  }
}