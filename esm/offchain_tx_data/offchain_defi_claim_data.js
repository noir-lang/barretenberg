export class OffchainDefiClaimData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainDefiClaimData.SIZE) throw Error('Invalid buffer size.');
        return new OffchainDefiClaimData();
    }
    toBuffer() {
        return Buffer.alloc(0);
    }
    constructor(){}
}
OffchainDefiClaimData.EMPTY = new OffchainDefiClaimData(), OffchainDefiClaimData.SIZE = 0;
