import { Injectable } from '@angular/core';
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

  constructor() { }

  public getContacts(): Contact[] {
    return initialData.map(this.cloneItem);
  }

  public getContact(id: string): Contact {
    const index = this.getIndex(id);
    return this.cloneItem(initialData[index]);
  }

  public addContact(contact: Contact) {
    initialData.push(contact);
  }

  public setContact(id: string, contact: Contact) {
    const index = this.getIndex(id);
    initialData[index] = contact;
  }

  public deleteContact(id: string) {
    const index = this.getIndex(id);
    initialData.splice(index, 1);
  }

  private cloneItem(item: Contact): Contact {
    const obj = Object.assign({}, item);
    return <Contact>obj;
  }

  private getIndex(id: string): number {
    let index = -1;
    initialData.forEach((e, i) => {
      if (e.id === id) {
        index = i;
        return false;
      }
    });
    return index;
  }
}
