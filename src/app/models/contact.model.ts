import { UUID } from './base.types';

export class Contact {
    public id: string;
    public firstName: string;
    public lastName?: string;
    public mobilePhone?: string;
    public email?: string;
    public birthDate?: Date;

    constructor() {
        this.id = UUID.generate();
        this.firstName = '';
        this.lastName = null;
        this.mobilePhone = null;
        this.email = null;
        this.birthDate = null;
    }
}
