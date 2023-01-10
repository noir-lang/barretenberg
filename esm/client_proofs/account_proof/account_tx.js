import { AliasHash } from '../../account_id';
import { GrumpkinAddress } from '../../address';
import { HashPath } from '../../merkle_tree';
import { numToUInt32BE } from '../../serialize';
export class AccountTx {
    toBuffer() {
        return Buffer.concat([
            this.merkleRoot,
            this.accountPublicKey.toBuffer(),
            this.newAccountPublicKey.toBuffer(),
            this.newSpendingPublicKey1.toBuffer(),
            this.newSpendingPublicKey2.toBuffer(),
            this.aliasHash.toBuffer32(),
            Buffer.from([
                this.create ? 1 : 0
            ]),
            Buffer.from([
                this.migrate ? 1 : 0
            ]),
            numToUInt32BE(this.accountIndex),
            this.accountPath.toBuffer(),
            this.spendingPublicKey.toBuffer()
        ]);
    }
    static fromBuffer(buf) {
        let dataStart = 0, merkleRoot = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let accountPublicKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let newAccountPublicKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let newSpendingPublicKey1 = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let newSpendingPublicKey2 = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let aliasHash = new AliasHash(buf.slice(dataStart + 4, dataStart + 32));
        dataStart += 32;
        let create = !!buf[dataStart];
        dataStart += 1;
        let migrate = !!buf[dataStart];
        dataStart += 1;
        let accountIndex = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let { elem: accountPath , adv  } = HashPath.deserialize(buf, dataStart);
        dataStart += adv;
        let spendingPublicKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        return new AccountTx(merkleRoot, accountPublicKey, newAccountPublicKey, newSpendingPublicKey1, newSpendingPublicKey2, aliasHash, create, migrate, accountIndex, accountPath, spendingPublicKey);
    }
    constructor(merkleRoot, accountPublicKey, newAccountPublicKey, newSpendingPublicKey1, newSpendingPublicKey2, aliasHash, create, migrate, accountIndex, accountPath, spendingPublicKey){
        this.merkleRoot = merkleRoot, this.accountPublicKey = accountPublicKey, this.newAccountPublicKey = newAccountPublicKey, this.newSpendingPublicKey1 = newSpendingPublicKey1, this.newSpendingPublicKey2 = newSpendingPublicKey2, this.aliasHash = aliasHash, this.create = create, this.migrate = migrate, this.accountIndex = accountIndex, this.accountPath = accountPath, this.spendingPublicKey = spendingPublicKey;
    }
}
