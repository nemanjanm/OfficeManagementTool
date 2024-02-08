import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { Report } from 'src/app/models/Report';
import { ReportCreateRequest } from 'src/app/models/ReportCreateRequest';
import { ReportFilterRequest } from 'src/app/models/ReportFilterRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getAllReports(filter: ReportFilterRequest): Observable<ActionResultResponse>{
    return this.http.get<ActionResultResponse>(environment.serverUrl + "/api/Report/all", {params: filter as any});
  }

  updateState(report: Report):  Observable<ActionResultResponse>{
    return this.http.put<ActionResultResponse>(environment.serverUrl + "/api/Report/updateState",report);
  }

  insertReport(report: ReportCreateRequest): Observable<ActionResultResponse>{
    return this.http.put<ActionResultResponse>(environment.serverUrl + "/api/Report/create", report);
  }
}
