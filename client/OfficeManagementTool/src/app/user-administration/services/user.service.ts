import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { UserPagingFilters } from 'src/app/shared/models/user-paging-filters';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = `${environment.serverUrl}/api/User`;

  constructor(private http: HttpClient) { }

  public usersPaging(filter: UserPagingFilters) : Observable<any> {
    let params = new HttpParams({ fromObject: filter as any });

    return this.http.get<any>(this.baseUrl + '/Pages', { params });
  }

  public addUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, user);
  }

  public updateUser(user: any): Observable<any> {
    return this.http.put<any>(this.baseUrl, user);
  }

  public deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}