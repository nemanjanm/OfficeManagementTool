import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateOrderRequest } from '../models/create-order-request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl: string = `${environment.serverUrl}/api/Order`;

  constructor(private http: HttpClient) { }

  public createOrder(params: CreateOrderRequest): Observable<any> {
    console.log(this.baseUrl);
    return this.http.post<any>(this.baseUrl, params);
  }
}
