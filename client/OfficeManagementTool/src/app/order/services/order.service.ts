import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';
import { OrderResponse } from 'src/app/models/OrderResponse';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrlOrder: string = "api/Order"

  public refreshRequired = new Subject<void>();
  
  constructor(private http: HttpClient) { }

  public getAllOrders() : Observable<OrderResponse[]>
  {
    return this.http.get<OrderResponse[]>(`${environment.serverUrl}/${this.apiUrlOrder}`);
  }

  public createOrder(): Observable<ActionResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
      return this.http
      .post<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrder}`, httpOptions)
      .pipe(tap(() => {
        this.refreshRequired.next();
      }));
    }

  public updateOrder(orderRequest: OrderItemRequest): Observable<ActionResultResponse> {
    return this.http
    .put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrder}`, orderRequest)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }

  public deleteOrder(id: number): Observable<ActionResultResponse> {
    return this.http
    .delete<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrder}/?id=${id}`)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }
}