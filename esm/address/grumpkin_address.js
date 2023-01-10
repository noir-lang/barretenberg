import { randomBytes } from '../crypto';
import { Grumpkin } from '../ecc/grumpkin';
export class GrumpkinAddress {
    static isAddress(address) {
        return /^(0x|0X)?[0-9a-fA-F]{128}$/.test(address);
    }
    static fromString(address) {
        if (!GrumpkinAddress.isAddress(address)) throw Error(`Invalid address string: ${address}`);
        return new GrumpkinAddress(Buffer.from(address.replace(/^0x/i, ''), 'hex'));
    }
    static random() {
        return new GrumpkinAddress(randomBytes(64));
    }
    static one() {
        return new GrumpkinAddress(Grumpkin.one);
    }
    equals(rhs) {
        return this.buffer.equals(rhs.toBuffer());
    }
    toBuffer() {
        return this.buffer;
    }
    x() {
        return this.buffer.slice(0, 32);
    }
    y() {
        return this.buffer.slice(32);
    }
    toString() {
        return `0x${this.buffer.toString('hex')}`;
    }
    toShortString() {
        let str = this.toString();
        return `${str.slice(0, 10)}...${str.slice(-4)}`;
    }
    constructor(buffer){
        if (this.buffer = buffer, buffer.length !== GrumpkinAddress.SIZE) throw Error('Invalid address buffer.');
    }
}
GrumpkinAddress.SIZE = 64, GrumpkinAddress.ZERO = new GrumpkinAddress(Buffer.alloc(GrumpkinAddress.SIZE));
