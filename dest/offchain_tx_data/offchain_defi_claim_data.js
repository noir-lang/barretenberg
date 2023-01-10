"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "OffchainDefiClaimData", {
    enumerable: !0,
    get: ()=>OffchainDefiClaimData
});
class OffchainDefiClaimData {
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
