import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { CategoryType } from 'src/app/models/CategoryType';
import { Equipment } from 'src/app/shared/models/equipment';
import { EquipmentPagingFilter } from 'src/app/shared/models/equipment-paging-filter';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl: string = "api/equipment";

  private itemApiUrl: string = "api/Item";

  constructor(private http: HttpClient) { }

  public refreshRequired = new Subject<void>();

  private selectedUserSubject = new Subject<User | null | undefined>();

  selectedUser$ = this.selectedUserSubject.asObservable();

  public getAllPagedEquipment(loadrequest: EquipmentPagingFilter): Observable<Equipment[]> {
    console.log("getAllPagedEquipment")
    let params = new HttpParams();
    params = params.set('PageIndex',loadrequest.PageIndex);
    params = params.set('PageSize',loadrequest.PageSize);

    if (loadrequest.Search) {
      params = params.set('Search',loadrequest.Search);
    }

    params = params.set("UserId",loadrequest.UserId);
    params = params.set("Assigned",loadrequest.Assigned);

    if (loadrequest.SortField) {
      params = params.set('SortField', loadrequest.SortField).set('SortOrder',loadrequest.SortOrder == 1? "asc" : 'desc');
    } else {
      params = params.set('SortField', 'name').set('SortOrder', "asc");
    }

    return this.http.get<Equipment[]>(`${environment.serverUrl}/${this.apiUrl}`, {params});
  }

  public getAllPagedAssignedEquipment(loadrequest: EquipmentPagingFilter): Observable<Equipment[]> {
    console.log("getAllPagedAssignedEquipment")
    let params = new HttpParams();
    params = params.set('PageIndex',loadrequest.PageIndex);
    params = params.set('PageSize',loadrequest.PageSize);

    if (loadrequest.Search) {
      params = params.set('Search',loadrequest.Search);
    }

    params = params.set("UserId",loadrequest.UserId);
    params = params.set("Assigned",loadrequest.Assigned);

    if (loadrequest.SortField) {
      params = params.set('SortField', loadrequest.SortField).set('SortOrder',loadrequest.SortOrder == 1? "asc" : 'desc');
    } else {
      params = params.set('SortField', 'name').set('SortOrder', "asc");
    }

    return this.http.get<Equipment[]>(`${environment.serverUrl}/${this.apiUrl}/assigned`, {params});
  }

  createEquipment(Equipment: Equipment): Observable<ActionResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http
      .post<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}`, Equipment, httpOptions)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
  }

  deleteEquipment(id: number): Observable<ActionResultResponse> {
    return this.http
    .delete<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}/${id}`)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }

  updateSelectedUser(user: User | null | undefined) {
    console.log("updateSelectedUser: "+user)
    this.selectedUserSubject.next(user);
  }

  getEquipmentItems(): Observable<any> {
    let params = new HttpParams().set('CategoryType', CategoryType.Equipment);
    return this.http.get<any>(`${environment.serverUrl}/${this.itemApiUrl}`, { params });
  }


  assignItemToUser(id: number, userId: number): Observable<ActionResultResponse> {
    return this.http.put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}`, {userId, id});
  }

  unassignItemFromUser(id: number): Observable<ActionResultResponse> 
  {
    var userId = 0;
    return this.http.put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrl}`, {id,userId});
  }
}