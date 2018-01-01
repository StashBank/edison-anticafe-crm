import { Tariff } from './tariff.model';
import { Lookup } from './base.types';

export class Product extends Lookup {
    public tariff: Tariff;

    constructor(args: any = {}) {
        super(args);
        this.tariff = args.tariff ? new Tariff(args.tariff) : null;
    }
}
