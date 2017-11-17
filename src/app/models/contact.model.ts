import { UUID } from './base.types';

export class Contact {
    public id: string;
    public firstName: string;
    public lastName?: string;
    public mobilePhone?: string;
    public email?: string;
    public birthDate?: Date;

    constructor(config = null) {
        this.id = config && config._id || UUID.generate();
        this.firstName = config && config.firstName || '';
        this.lastName = config && config.lastName || null;
        this.mobilePhone = config && config.mobilePhone || null;
        this.email = config && config.email || null;
        this.birthDate = config && config.birthDate || null;
    }
}
