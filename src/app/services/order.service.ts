import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

import { Order } from '../models/order.model';


@Injectable()
export class OrderService {

  private dataServiceURI = '/api/orderService';

  constructor(private http: HttpClient) { }

  public getOrders(): Observable<any> {
    return this.http.get(this.dataServiceURI);
  }

  public getOrder(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/${id}`);
  }

  public getOrderByContact(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/contact/${id}`);
  }

  public add(order: Order): Observable<any> {
    return this.http.post(this.dataServiceURI, order);
  }

  public update(id: string, order: Order): Observable<any> {
    Object.assign(order, {product: order.product && order.product.value});
    return this.http.put(`${this.dataServiceURI}/${id}`, order);
  }

  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.dataServiceURI}/${id}`);
  }

  public perform(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/perform`, { orderId });
  }

  public postpone(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/postpone`, { orderId });
  }

  public continue(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/continue`, { orderId });
  }

  public close(orderId: string, manualCost?: number): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/close`, { orderId, manualCost });
  }

  public reject(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/reject`, { orderId });
  }
}
