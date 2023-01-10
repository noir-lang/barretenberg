"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "OffchainJoinSplitData", {
    enumerable: !0,
    get: ()=>OffchainJoinSplitData
});
const _serialize = require("../serialize"), _viewingKey = require("../viewing_key");
class OffchainJoinSplitData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainJoinSplitData.SIZE) throw Error('Invalid buffer size.');
        let dataStart = 0, viewingKey0 = new _viewingKey.ViewingKey(buf.slice(dataStart, dataStart + _viewingKey.ViewingKey.SIZE));
        dataStart += _viewingKey.ViewingKey.SIZE;
        let viewingKey1 = new _viewingKey.ViewingKey(buf.slice(dataStart, dataStart + _viewingKey.ViewingKey.SIZE));
        dataStart += _viewingKey.ViewingKey.SIZE;
        let txRefNo = buf.readUInt32BE(dataStart);
        return new OffchainJoinSplitData([
            viewingKey0,
            viewingKey1
        ], txRefNo);
    }
    toBuffer() {
        return Buffer.concat([
            ...this.viewingKeys.map((k)=>k.toBuffer()),
            (0, _serialize.numToUInt32BE)(this.txRefNo)
        ]);
    }
    constructor(viewingKeys, txRefNo = 0){
        if (this.viewingKeys = viewingKeys, this.txRefNo = txRefNo, 2 !== viewingKeys.length) throw Error(`Expect 2 viewing keys. Received ${viewingKeys.length}.`);
        if (viewingKeys.some((vk)=>vk.isEmpty())) throw Error('Viewing key cannot be empty.');
    }
}
OffchainJoinSplitData.EMPTY = new OffchainJoinSplitData([
    new _viewingKey.ViewingKey(Buffer.alloc(_viewingKey.ViewingKey.SIZE)),
    new _viewingKey.ViewingKey(Buffer.alloc(_viewingKey.ViewingKey.SIZE))
]), OffchainJoinSplitData.SIZE = OffchainJoinSplitData.EMPTY.toBuffer().length;
