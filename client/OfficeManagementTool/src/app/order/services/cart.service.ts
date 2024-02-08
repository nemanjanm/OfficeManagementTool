import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { OrderRequest } from 'src/app/models/OrderRequest';
import { RequestOrderFilter } from 'src/app/models/RequestOrderFilter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  updateCart(orderRequest: any): Observable<ActionResultResponse>{
    return this.http.put<ActionResultResponse>(environment.serverUrl + "/api/OrderRequest", orderRequest);
  }

  getOrderRequests(req: RequestOrderFilter): Observable<ActionResultResponse>{
    return this.http.get<ActionResultResponse>(environment.serverUrl + "/api/OrderRequest", {params: req as any});
  }

  addToCart(orderRequest: any): Observable<ActionResultResponse>{
    return this.http.post<ActionResultResponse>(environment.serverUrl + "/api/OrderRequest", orderRequest);
  }

  deleteOrder(id: number): Observable<ActionResultResponse>{
    return this.http.delete<ActionResultResponse>(environment.serverUrl + "/api/OrderRequest", {params: {id:id}});
  }
}
