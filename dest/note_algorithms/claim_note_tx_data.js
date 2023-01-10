"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ClaimNoteTxData", {
    enumerable: !0,
    get: ()=>ClaimNoteTxData
});
const _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id");
class ClaimNoteTxData {
    toBuffer() {
        return Buffer.concat([
            (0, _bigintBuffer.toBufferBE)(this.value, 32),
            this.bridgeId.toBuffer(),
            this.partialStateSecret,
            this.inputNullifier
        ]);
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    static fromBuffer(buf) {
        let dataStart = 0, value = (0, _bigintBuffer.toBigIntBE)(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let bridgeId = _bridgeId.BridgeId.fromBuffer(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let partialStateSecret = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let inputNullifier = buf.slice(dataStart, dataStart + 32);
        return new ClaimNoteTxData(value, bridgeId, partialStateSecret, inputNullifier);
    }
    constructor(value, bridgeId, partialStateSecret, inputNullifier){
        this.value = value, this.bridgeId = bridgeId, this.partialStateSecret = partialStateSecret, this.inputNullifier = inputNullifier;
    }
}
ClaimNoteTxData.EMPTY = new ClaimNoteTxData(BigInt(0), _bridgeId.BridgeId.ZERO, Buffer.alloc(32), Buffer.alloc(32)), ClaimNoteTxData.SIZE = ClaimNoteTxData.EMPTY.toBuffer().length;
