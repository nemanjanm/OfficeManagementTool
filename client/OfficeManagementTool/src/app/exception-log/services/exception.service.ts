import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExceptionLog } from 'src/app/shared/models/exception-log';
import { ExceptionPagingFilter } from 'src/app/shared/models/exception-paging-filter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  private apiUrl: string = "api/exception";

  constructor(private http: HttpClient) { }

  public getAllExceptions(loadrequest: ExceptionPagingFilter): Observable<ExceptionLog[]> {
    console.log("getAllExceptions")
    let params = new HttpParams();
    params = params.set('PageIndex',loadrequest.PageIndex);
    params = params.set('PageSize',loadrequest.PageSize);

    if (loadrequest.Search) {
      params = params.set('SearchTerm',loadrequest.Search);
    }

    if (loadrequest.SortField) {
      params = params.set('SortField', loadrequest.SortField).set('SortOrder',loadrequest.SortOrder == 1? "asc" : 'desc');
    } else {
      params = params.set('SortField', 'name').set('SortOrder', "asc");
    }

    return this.http.get<ExceptionLog[]>(`${environment.serverUrl}/${this.apiUrl}`, {params});
  }
}