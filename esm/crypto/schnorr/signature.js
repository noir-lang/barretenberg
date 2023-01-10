import { randomBytes } from '../random';
export class SchnorrSignature {
    static isSignature(signature) {
        return /^(0x)?[0-9a-f]{128}$/i.test(signature);
    }
    static fromString(signature) {
        if (!SchnorrSignature.isSignature(signature)) throw Error(`Invalid signature string: ${signature}`);
        return new SchnorrSignature(Buffer.from(signature.replace(/^0x/i, ''), 'hex'));
    }
    static randomSignature() {
        return new SchnorrSignature(randomBytes(64));
    }
    s() {
        return this.buffer.slice(0, 32);
    }
    e() {
        return this.buffer.slice(32);
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return `0x${this.buffer.toString('hex')}`;
    }
    constructor(buffer){
        if (this.buffer = buffer, buffer.length !== SchnorrSignature.SIZE) throw Error('Invalid signature buffer.');
    }
}
SchnorrSignature.SIZE = 64;
