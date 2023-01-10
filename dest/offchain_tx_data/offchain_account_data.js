"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "OffchainAccountData", {
    enumerable: !0,
    get: ()=>OffchainAccountData
});
const _accountId = require("../account_id"), _address = require("../address"), _serialize = require("../serialize");
class OffchainAccountData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainAccountData.SIZE) throw Error(`Invalid buffer size: ${buf.length} != ${OffchainAccountData.SIZE}`);
        let dataStart = 0, accountPublicKey = new _address.GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let aliasHash = new _accountId.AliasHash(buf.slice(dataStart, dataStart + _accountId.AliasHash.SIZE));
        dataStart += _accountId.AliasHash.SIZE;
        let spendingPublicKey1 = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let spendingPublicKey2 = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let txRefNo = buf.readUInt32BE(dataStart);
        return new OffchainAccountData(accountPublicKey, aliasHash, spendingPublicKey1, spendingPublicKey2, txRefNo);
    }
    toBuffer() {
        return Buffer.concat([
            this.accountPublicKey.toBuffer(),
            this.aliasHash.toBuffer(),
            this.spendingPublicKey1,
            this.spendingPublicKey2,
            (0, _serialize.numToUInt32BE)(this.txRefNo)
        ]);
    }
    constructor(accountPublicKey, aliasHash, spendingPublicKey1 = Buffer.alloc(32), spendingPublicKey2 = Buffer.alloc(32), txRefNo = 0){
        if (this.accountPublicKey = accountPublicKey, this.aliasHash = aliasHash, this.spendingPublicKey1 = spendingPublicKey1, this.spendingPublicKey2 = spendingPublicKey2, this.txRefNo = txRefNo, 32 !== spendingPublicKey1.length) throw Error('Expect spendingPublicKey1 to be 32 bytes.');
        if (32 !== spendingPublicKey2.length) throw Error('Expect spendingPublicKey2 to be 32 bytes.');
    }
}
OffchainAccountData.EMPTY = new OffchainAccountData(_address.GrumpkinAddress.ZERO, _accountId.AliasHash.ZERO), OffchainAccountData.SIZE = OffchainAccountData.EMPTY.toBuffer().length;
