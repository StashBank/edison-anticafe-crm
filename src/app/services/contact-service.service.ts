import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Contact } from '../models/contact.model';
import { UUID } from '../models/base.types';
import 'rxjs/add/operator/map';


@Injectable()
export class ContactServiceService {

  private dataServiceURI = '/api/dataservice';

  constructor(private http: Http) { }

  public getContacts(): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/contactCollection`)
      .map(res => res.json());
  }

  public getContact(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/contact/${id}`)
      .map(res => res.json());
  }

  public addContact(contact: Contact): Observable<any> {
    return this.http.post(`${this.dataServiceURI}/contact`, contact)
      .map(res => res.json());
  }

  public setContact(id: string, contact: Contact): Observable<any> {
  return this.http.put(`${this.dataServiceURI}/contact/${id}`, contact)
    .map(res => res.json());
  }

  public deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.dataServiceURI}/contact/${id}`)
    .map(res => res.json());
  }
}
