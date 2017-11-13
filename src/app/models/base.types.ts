export class UUID {

    static generate(): string {
        const lut = [];
        for (let i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
        const d0 = UUID.getRandom();
        const d1 = UUID.getRandom();
        const d2 = UUID.getRandom();
        const d3 = UUID.getRandom();
         // tslint:disable-next-line:no-bitwise
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            // tslint:disable-next-line:no-bitwise
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            // tslint:disable-next-line:no-bitwise
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            // tslint:disable-next-line:no-bitwise
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    private static getRandom() {
        // tslint:disable-next-line:no-bitwise
        return Math.random() * 0xffffffff | 0;
    }
}
