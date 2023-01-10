import { GrumpkinAddress } from '../address';
export class AccountId {
    static fromBuffer(id) {
        if (68 !== id.length) throw Error('Invalid id buffer.');
        let publicKey = new GrumpkinAddress(id.slice(0, 64)), accountNonce = id.readUInt32BE(64);
        return new AccountId(publicKey, accountNonce);
    }
    static fromString(idStr) {
        let [match, publicKeyStr, accountNonceStr] = idStr.match(/^0x([0-9a-f]{128}) \(([0-9]+)\)$/i) || [];
        if (!match) throw Error('Invalid id string.');
        let publicKey = GrumpkinAddress.fromString(publicKeyStr);
        return new AccountId(publicKey, +accountNonceStr);
    }
    static random() {
        return new AccountId(GrumpkinAddress.random(), Math.floor(4294967296 * Math.random()));
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
    toBuffer() {
        let accountNonceBuf = Buffer.alloc(4);
        return accountNonceBuf.writeUInt32BE(this.accountNonce), Buffer.concat([
            this.publicKey.toBuffer(),
            accountNonceBuf
        ]);
    }
    toString() {
        return `${this.publicKey.toString()} (${this.accountNonce})`;
    }
    toShortString() {
        return `${this.publicKey.toString().slice(0, 10)}/${this.accountNonce}`;
    }
    constructor(publicKey, accountNonce){
        this.publicKey = publicKey, this.accountNonce = accountNonce;
    }
}
