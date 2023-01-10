import { AliasHash } from './alias_hash';
export class AccountAliasId {
    static fromAlias(alias, accountNonce, blake2s) {
        return new AccountAliasId(AliasHash.fromAlias(alias, blake2s), accountNonce);
    }
    static random() {
        return new AccountAliasId(AliasHash.random(), 0);
    }
    static fromBuffer(id) {
        if (32 !== id.length) throw Error('Invalid id buffer.');
        let aliasHash = new AliasHash(id.slice(4, 32)), accountNonce = id.readUInt32BE(0);
        return new AccountAliasId(aliasHash, accountNonce);
    }
    toBuffer() {
        let accountNonceBuf = Buffer.alloc(4);
        return accountNonceBuf.writeUInt32BE(this.accountNonce), Buffer.concat([
            accountNonceBuf,
            this.aliasHash.toBuffer()
        ]);
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(rhs) {
        return this.aliasHash.equals(rhs.aliasHash) && this.accountNonce === rhs.accountNonce;
    }
    constructor(aliasHash, accountNonce){
        this.aliasHash = aliasHash, this.accountNonce = accountNonce;
    }
}
AccountAliasId.ZERO = AccountAliasId.fromBuffer(Buffer.alloc(32));
