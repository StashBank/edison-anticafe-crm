import { Lookup } from './base.types';

export class TariffType extends Lookup {

    public code: string;

    constructor(args: any = {}) {
        super(args);
        this.code = args.code;
    }
}

export class Tariff extends Lookup {

    public type: TariffType;
    public cost: number;
    public position: number;
    public childrens: Tariff[];
    public parent: Tariff;

    constructor(args: any = {}) {
        super(args);
        this.type = args.type ? new TariffType(args.type) : null;
        this.cost = args.cost;
        this.position = args.position;
        this.childrens = args.childrens ? args.childrens.map(t => new Tariff(t)) : [];
        this.parent = args.parent ? new Tariff(args.parent) : null;
    }
}
