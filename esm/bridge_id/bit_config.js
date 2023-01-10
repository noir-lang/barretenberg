let getNumber = (val, offset, size)=>Number(val >> BigInt(offset) & (BigInt(1) << BigInt(size)) - BigInt(1));
export class BitConfig {
    static fromBigInt(val) {
        return new BitConfig(0 != getNumber(val, 0, 1), 0 != getNumber(val, 1, 1));
    }
    toBigInt() {
        return BigInt(this.secondInputInUse) + (BigInt(this.secondOutputInUse) << BigInt(1));
    }
    constructor(secondInputInUse, secondOutputInUse){
        this.secondInputInUse = secondInputInUse, this.secondOutputInUse = secondOutputInUse;
    }
}
BitConfig.EMPTY = new BitConfig(!1, !1);
