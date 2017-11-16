import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Contact } from '../models/contact.model';
import { UUID } from '../models/base.types';


const initialData: Contact[] = [{
  id: UUID.generate(),
  firstName: '1-Тестовий',
  lastName: '1-Клієнт',
  mobilePhone: '0123456789',
  email: 'some-mail-1@email.com',
  birthDate: new Date(1989, 5, 26)
}, {
  id: UUID.generate(),
  firstName: '2-Тестовий',
  lastName: '2-Клієнт',
  mobilePhone: '0123456788',
  email: 'some-mail-2@email.com',
  birthDate: new Date(1989, 5, 27)
}, {
  id: UUID.generate(),
  firstName: '3-Тестовий',
  lastName: '3-Клієнт',
  mobilePhone: '0123456787',
  email: 'some-mail-3@email.com',
  birthDate: new Date(1989, 5, 28)
}];

@Injectable()
export class ContactServiceService {

  constructor(private http: Http) { }

  public getContacts(): Observable<any> {
    return this.http.get('/api/dataservice/contactCollection')
      .map(res => res.json());
  }

  public getContact(id: string): Observable<any> {
    return this.http.get(`/api/dataservice/contact/${id}`)
      .map(res => res.json());
  }

  public addContact(contact: Contact): Observable<any> {
    return this.http.post('/api/dataservice/contact', contact)
      .map(res => res.json());
  }

  public setContact(id: string, contact: Contact): Observable<any> {
    return this.http.put(`/api/dataservice/contact/${id}`, contact)
      .map(res => res.json());
  }

  public deleteContact(id: string) {
    return this.http.delete(`/api/dataservice/contact/${id}`)
      .map(res => res.json());
  }
}
