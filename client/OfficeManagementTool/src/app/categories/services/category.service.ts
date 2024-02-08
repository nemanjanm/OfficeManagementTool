import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { Category } from 'src/app/models/category';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string = "api/Category"

  constructor(private http: HttpClient) { }

  public refreshRequired = new Subject<void>();

  public getAllCategories(loadrequest: LoadRequest) : Observable<Category[]>{
    let params = new HttpParams();

    if(loadrequest.currentPage != null) {
      params = params.set("PageIndex", loadrequest.currentPage)
    }

    if(loadrequest.pageSize != null) {
      params = params.set("PageSize", loadrequest.pageSize)
    }

    if(loadrequest.sortCategory != null) {
      params = params.set("CategoryType", loadrequest.sortCategory)
    }

    if (loadrequest.searchTerm) {
      params = params.set('CategoryName',loadrequest.searchTerm);
    }

    if (loadrequest.sortField) {
      params = params.set('sortField', loadrequest.sortField).set('sortOrder',loadrequest.sortOrder == 1? "1" : '-1');
    } else {
      params = params.set('sortField', 'name').set('sortOrder', "1");
    }

    return this.http.get<Category[]>(`${environment.serverUrl}/${this.apiUrl}`, {params});

  }

  public createCategory(category: Category): Observable<ActionResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http
      .post<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}`, category, httpOptions)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  public updateCategory(category: Category): Observable<ActionResultResponse> {
    return this.http
    .put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}`, category)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));

  }

  public deleteCategory(id: number): Observable<ActionResultResponse> {
    return this.http
    .delete<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}/?id=${id}`)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }
}