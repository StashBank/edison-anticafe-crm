import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class LookupsService {

  private serviceURI = '/api/lookupservice';

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(this.serviceURI);
  }

  public getLookupData(lookupName: string): Observable<any> {
    return this.http.get(`${this.serviceURI}/lookupData/${lookupName}`);
  }

  public getLookupItem(lookupName: string, id: string): Observable<any> {
    return this.http.get(`${this.serviceURI}/lookupItem/${lookupName}/${id}`);
  }

  public addLookupItem(lookupName: string, data: any): Observable<any> {
    return this.http.post(`${this.serviceURI}/lookupItem/${lookupName}`, data);
  }

  public setLookupItem(lookupName: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.serviceURI}/lookupItem/${lookupName}/${id}`, data);
  }

  public deleteLookupItem(lookupName: string, id: string): Observable<any> {
    return this.http.delete(`${this.serviceURI}/lookupItem/${lookupName}/${id}`);
  }

}
