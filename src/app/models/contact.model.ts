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
        this.birthDate = contact.birthDate || null;
    }
}
