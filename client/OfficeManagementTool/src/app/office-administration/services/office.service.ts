import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/shared/models/action-result-response-view-model';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { Office } from 'src/app/shared/models/office';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private apiUrl: string = "api/office";

  constructor(private http: HttpClient) { }

  public refreshRequired = new Subject<void>();

  public getAllOffices(loadrequest: LoadRequest): Observable<Office[]> {
    let params = new HttpParams();

    if (loadrequest.searchTerm) {
      params = params.set('searchTerm',loadrequest.searchTerm);
    }

    if (loadrequest.sortField) {
      params = params.set('sortField', loadrequest.sortField).set('sortOrder',loadrequest.sortOrder == 1? "asc" : 'desc');
    } else {
      params = params.set('sortField', 'name').set('sortOrder', "asc");
    }

    return this.http.get<Office[]>(`${environment.serverUrl}/${this.apiUrl}`, {params});
  }

  createOffice(office: Office): Observable<ActionResultResponse<string>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http
      .post<ActionResultResponse<string>>(`${environment.serverUrl}/${this.apiUrl}`, office, httpOptions)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  updateOffice(office: Office): Observable<ActionResultResponse<string>> {
    return this.http
    .put<ActionResultResponse<string>>(`${environment.serverUrl}/${this.apiUrl}`, office)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));

  }

  deleteOffice(id: number): Observable<ActionResultResponse<string>> {
    return this.http
    .delete<ActionResultResponse<string>>(`${environment.serverUrl}/${this.apiUrl}/${id}`)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }
}
