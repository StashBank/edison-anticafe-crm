import { UUID, Lookup } from './base.types';
import { Contact } from './contact.model';
import { Product } from './product.model';

export class OrderStatus extends Lookup {
    public code: string;
    public isFinal: boolean;

    constructor(args: any = {}) {
        super(args);
        this.code = args.code;
        this.isFinal = args.isFinal;
    }
}

export class Order {

    public id: string;
    public contact: Contact;
    public contactName: string;
    public number: number;
    public product: Product;
    public products: Product[];
    public status: OrderStatus;
    public startDate = new Date();
    public endDate?: Date;
    public cost?: number;
    public notes?: string;
    public timeline?: {index: number, timelines: [{startDate: Date, endDate: Date}]};

    constructor(args: any = {}) {
        this.id = args.id || args._id || UUID.generate();
        this.contact = args.contact ? new Contact(args.contact) : null;
        this.contactName = args.contactName;
        this.number = args.number || 0;
        this.product = args.product ? new Product(args.product) : null;
        this.status = args.status ? new OrderStatus(args.status) : null;
        this.startDate = this.getDate(args.startDate);
        this.endDate = this.getDate(args.endDate);
        this.cost = args.cost;
        this.notes = args.notes;
        this.products = args.products ? args.products.map(p => new Product(p)) : [];
        this.timeline = args.timeline;
    }

    public get client() {
        return this.contactName || this.contact && this.contact.fullName;
    }

    getDate(date): Date {
        if (!date) {
            return date;
        }
        if (date.constructor === Date) {
            return date;
        }
        const dateValue = Date.parse(date);
        if (!isNaN(dateValue)) {
            return new Date(dateValue);
        }
        return null;
    }
}
