import { UUID, Lookup } from './base.types';

export class Contact {
    public id: string;
    public contactId: Number;
    public firstName: string;
    public lastName?: string;
    public mobilePhone?: string;
    public email?: string;
    public birthDate?: Date;
    public notes: String;
    public age?: Lookup;
    public product?: Lookup;
    public target?: Lookup;

    constructor(contact: any = {}) {
        this.id = contact._id || UUID.generate();
        this.contactId = contact.contactId;
        this.firstName = contact.firstName || '';
        this.lastName = contact.lastName || null;
        this.mobilePhone = contact.mobilePhone || null;
        this.email = contact.email || null;
        this.birthDate = this.getBirthDate(contact.birthDate || null);
        this.notes = contact.notes;
        this.age = contact.age ? new Lookup(contact.age) : null;
        this.product = contact.product ? new Lookup(contact.product) : null;
        this.target = contact.target ? new Lookup(contact.target) : null;
    }

    public get fullName(): String {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }

    getBirthDate(birthDate): Date {
        if (!birthDate) {
            return birthDate;
        }
        if (birthDate.constructor === Date) {
            return birthDate;
        }
        const dateValue = Date.parse(birthDate);
        if (!isNaN(dateValue)) {
            return new Date(dateValue);
        }
        return null;
    }
}
