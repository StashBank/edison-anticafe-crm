import { UUID } from './base.types';

export class Contact {
    public id: string;
    public firstName: string;
    public lastName?: string;
    public mobilePhone?: string;
    public email?: string;
    public birthDate?: Date;

    constructor(contact: any = {}) {
        this.id = contact._id || UUID.generate();
        this.firstName = contact.firstName || '';
        this.lastName = contact.lastName || null;
        this.mobilePhone = contact.mobilePhone || null;
        this.email = contact.email || null;
        this.birthDate = this.getBirthDate(contact.birthDate || null);
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
