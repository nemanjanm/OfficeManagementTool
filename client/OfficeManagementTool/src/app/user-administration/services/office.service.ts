import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private baseUrl: string = `${environment.serverUrl}/api/office`;

  constructor(private http: HttpClient) { }

  getAllOffices(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
