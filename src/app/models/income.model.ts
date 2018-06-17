import { Order } from './order.model';
import { Lookup, UUID } from './base.types';

export class IncomeType extends Lookup { }

export class Income {

  id: string;
  type: IncomeType;
  date: Date;
  amount: Number;
  order: Order;

  constructor(args: any = {}) {
    this.id = args.id || args._id || UUID.generate();
    this.type = args && args.type ? new IncomeType(args.type) : null;
    this.date = this.getDate(args.date);
    this.amount = args.amount || 0;
    this.order = args.order ? new Order(args.order) : null;
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
