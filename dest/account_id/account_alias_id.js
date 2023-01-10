"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "AccountAliasId", {
    enumerable: !0,
    get: ()=>AccountAliasId
});
const _aliasHash = require("./alias_hash");
class AccountAliasId {
    static fromAlias(alias, accountNonce, blake2s) {
        return new AccountAliasId(_aliasHash.AliasHash.fromAlias(alias, blake2s), accountNonce);
    }
    static random() {
        return new AccountAliasId(_aliasHash.AliasHash.random(), 0);
    }
    static fromBuffer(id) {
        if (32 !== id.length) throw Error('Invalid id buffer.');
        let aliasHash = new _aliasHash.AliasHash(id.slice(4, 32)), accountNonce = id.readUInt32BE(0);
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
