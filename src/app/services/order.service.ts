import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Order } from '../models/order.model';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {

  private dataServiceURI = '/api/orderService';

  constructor(private http: Http) { }

  public getOrders(): Observable<any> {
    return this.http.get(this.dataServiceURI)
      .map(res => res.json());
  }

  public getOrder(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/${id}`)
      .map(res => res.json());
  }

  public getOrderByContact(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/contact/${id}`)
      .map(res => res.json());
  }

  public add(order: Order): Observable<any> {
    return this.http.post(this.dataServiceURI, order)
      .map(res => res.json());
  }

  public update(id: string, order: Order): Observable<any> {
    return this.http.put(`${this.dataServiceURI}/${id}`, order)
      .map(res => res.json());
  }

  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.dataServiceURI}/${id}`)
      .map(res => res.json());
  }

  public perform(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/perform`, { orderId })
      .map(res => res.json());
  }

  public postpone(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/postpone`, { orderId })
      .map(res => res.json());
  }

  public continue(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/continue`, { orderId })
      .map(res => res.json());
  }

  public close(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/close`, { orderId })
      .map(res => res.json());
  }

  public reject(orderId: string): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/reject`, { orderId })
      .map(res => res.json());
  }
}
