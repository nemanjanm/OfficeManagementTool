import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  private apiUrlOrderItem: string = "api/OrderAttachment"
  constructor(private http: HttpClient) { }

  public refreshRequired = new Subject<void>();
  
  public addAttachment(attachment: FormData): Observable<ActionResultResponse> {
      return this.http
      .post<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrderItem}`, attachment )
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  public getAllAttachments(id: number): Observable<ActionResultResponse> {
    return this.http
      .get<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrderItem}?id=${id}`)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  public deleteAttachment(id: number): Observable<ActionResultResponse> {
    return this.http
      .delete<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrderItem}?id=${id}`)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  public downloadAttachment(id: number): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.apiUrlOrderItem}/Download`, { params: { id }, responseType: 'blob' as 'json' } );
  }
}
