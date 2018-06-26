import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

import { Contact } from '../models/contact.model';



@Injectable()
export class ContactServiceService {

  private dataServiceURI = '/api/contactService';

  constructor(private http: HttpClient) { }

  public getContacts(): Observable<any> {
    return this.http.get(this.dataServiceURI);
  }

  public getContact(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/${id}`);
  }

  public addContact(contact: Contact): Observable<any> {
    return this.http.post(this.dataServiceURI, contact);
  }

  public setContact(id: string, contact: Contact): Observable<any> {
  return this.http.put(`${this.dataServiceURI}/${id}`, contact);
  }

  public deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.dataServiceURI}/${id}`);
  }
}
