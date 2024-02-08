import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';
import { OrderItemResponse } from 'src/app/models/OrderItemResponse';
import { OrderResponse } from 'src/app/models/OrderResponse';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

  private apiUrlOrderItem: string = "api/OrderItem"

  public refreshRequired = new Subject<void>();
  
  constructor(private http: HttpClient) { }

  public getAllOrders(id: number) : Observable<OrderItemResponse[]>
  {
    return this.http.get<OrderItemResponse[]>(`${environment.serverUrl}/${this.apiUrlOrderItem}/id?id=${id}`);
  }

  public updateOrderItem(orderItemRequest: OrderItemRequest): Observable<ActionResultResponse> {
    return this.http
    .put<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrderItem}`, orderItemRequest)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }

  public deleteOrderItem(id: number): Observable<ActionResultResponse> {
    return this.http
    .delete<ActionResultResponse>(`${environment.serverUrl}/${this.apiUrlOrderItem}/?id=${id}`)
    .pipe(tap(() => {
      this.refreshRequired.next();
    }));
  }
}
