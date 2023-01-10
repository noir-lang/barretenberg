import { AliasHash } from '../account_id';
import { GrumpkinAddress } from '../address';
import { numToUInt32BE } from '../serialize';
export class OffchainAccountData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainAccountData.SIZE) throw Error(`Invalid buffer size: ${buf.length} != ${OffchainAccountData.SIZE}`);
        let dataStart = 0, accountPublicKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let aliasHash = new AliasHash(buf.slice(dataStart, dataStart + AliasHash.SIZE));
        dataStart += AliasHash.SIZE;
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
            numToUInt32BE(this.txRefNo)
        ]);
    }
    constructor(accountPublicKey, aliasHash, spendingPublicKey1 = Buffer.alloc(32), spendingPublicKey2 = Buffer.alloc(32), txRefNo = 0){
        if (this.accountPublicKey = accountPublicKey, this.aliasHash = aliasHash, this.spendingPublicKey1 = spendingPublicKey1, this.spendingPublicKey2 = spendingPublicKey2, this.txRefNo = txRefNo, 32 !== spendingPublicKey1.length) throw Error('Expect spendingPublicKey1 to be 32 bytes.');
        if (32 !== spendingPublicKey2.length) throw Error('Expect spendingPublicKey2 to be 32 bytes.');
    }
}
OffchainAccountData.EMPTY = new OffchainAccountData(GrumpkinAddress.ZERO, AliasHash.ZERO), OffchainAccountData.SIZE = OffchainAccountData.EMPTY.toBuffer().length;
