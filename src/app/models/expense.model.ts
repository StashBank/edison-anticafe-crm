import { Lookup, UUID } from './base.types';

export class ExpenseType extends Lookup { }

export class Expense {

  id: string;
  type: ExpenseType;
  date: Date;
  amount: Number;

  constructor(args: any = {}) {
    this.id = args.id || args._id || UUID.generate();
    this.type = args && args.type ? new ExpenseType(args.type) : null;
    this.date = this.getDate(args.date);
    this.amount = args.amount || 0;
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
