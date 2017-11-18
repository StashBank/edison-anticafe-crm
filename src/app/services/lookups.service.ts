import { Contact } from './../models/contact.model';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()
export class LookupsService {

  private serviceURI = '/api/lookupservice';

  constructor(private http: Http) { }

  get(): Observable<any[]> {
    return this.http.get(this.serviceURI)
      .map(res => res.json());
  }

  public getLookupData(lookupName: string): Observable<any> {
    return this.http.get(`${this.serviceURI}/lookupData/${lookupName}`)
      .map(res => res.json());
  }

  public getLookupItem(lookupName: string, id: string): Observable<any> {
    return this.http.get(`${this.serviceURI}/lookupItem/${lookupName}/${id}`)
      .map(res => res.json());
  }

  public addLookupItem(lookupName: string, data: any): Observable<any> {
    return this.http.post(`${this.serviceURI}/lookupItem/${lookupName}`, data)
      .map(res => res.json());
  }

  public setLookupItem(lookupName: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.serviceURI}/lookupItem/${lookupName}/${id}`, data)
      .map(res => res.json());
  }

  public deleteLookupItem(lookupName: string, id: string): Observable<any> {
    return this.http.delete(`${this.serviceURI}/lookupItem/${lookupName}/${id}`)
      .map(res => res.json());
  }

}
