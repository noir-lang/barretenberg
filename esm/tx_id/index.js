import { randomBytes } from '../crypto';
export class TxId {
    static deserialize(buffer, offset) {
        return {
            elem: new TxId(buffer.slice(offset, offset + 32)),
            adv: 32
        };
    }
    static fromString(hash) {
        return new TxId(Buffer.from(hash.replace(/^0x/i, ''), 'hex'));
    }
    static random() {
        return new TxId(randomBytes(32));
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    toDepositSigningData() {
        let digest = this.toString();
        return Buffer.concat([
            Buffer.from('Signing this message will allow your pending funds to be spent in Aztec transaction:\n\n'),
            Buffer.from(digest),
            Buffer.from('\n\nIMPORTANT: Only sign the message if you trust the client')
        ]);
    }
    constructor(buffer){
        if (this.buffer = buffer, 32 !== buffer.length) throw Error('Invalid hash buffer.');
    }
}
