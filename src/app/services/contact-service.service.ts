import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';


const initialData: Contact[] = [{
  firstName: "1-Тестовий",
  lastName: "1-Клієнт",
  mobilePhone: "0123456789",
  email: "some-mail-1@email.com",
  birthDate: new Date(1989, 5, 26)
}, {
  firstName: "2-Тестовий",
  lastName: "2-Клієнт",
  mobilePhone: "0123456788",
  email: "some-mail-2@email.com",
  birthDate: new Date(1989, 5, 27)
}, {
  firstName: "3-Тестовий",
  lastName: "3-Клієнт",
  mobilePhone: "0123456787",
  email: "some-mail-3@email.com",
  birthDate: new Date(1989, 5, 28)
}];

@Injectable()
export class ContactServiceService {

  constructor() { }

  public getContacts() : Contact[] {
    return initialData.map(this.cloneItem);
  }

  public getContact(id: number) : Contact {
    return this.cloneItem(initialData[id]);
  }

  public addContact(contact: Contact) {
    initialData.push(contact);
  }

  public setContact(id: number, contact: Contact) {
    initialData[id] = contact;
  }

  public deleteContact(id: number) {
    initialData.splice(id, 1);
  }

  private cloneItem(item: Contact): Contact {
    let obj = JSON.parse(JSON.stringify(item));
    obj.birthDate = obj.birthDate && new Date(Date.parse(obj.birthDate));
    return <Contact>obj;
  }
}
