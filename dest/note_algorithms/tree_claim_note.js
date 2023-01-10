"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "TreeClaimNote", {
    enumerable: !0,
    get: ()=>TreeClaimNote
});
const _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _crypto = require("../crypto"), _serialize = require("../serialize");
class TreeClaimNote {
    static random() {
        return new TreeClaimNote((0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), _bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(4).readUInt32BE(0), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32));
    }
    static deserialize(buf, offset) {
        return {
            elem: TreeClaimNote.fromBuffer(buf.slice(offset, offset + TreeClaimNote.LENGTH)),
            adv: TreeClaimNote.LENGTH
        };
    }
    static fromBuffer(buf) {
        let value = (0, _bigintBuffer.toBigIntBE)(buf.slice(0, 32)), offset = 32, bridgeId = _bridgeId.BridgeId.fromBuffer(buf.slice(offset, offset + _bridgeId.BridgeId.ENCODED_LENGTH_IN_BYTES));
        offset += 32;
        let defiInteractionNonce = buf.readUInt32BE(offset);
        offset += 4;
        let fee = (0, _bigintBuffer.toBigIntBE)(buf.slice(offset, offset + 32));
        offset += 32;
        let partialState = buf.slice(offset, offset + 32);
        offset += 32;
        let inputNullifier = buf.slice(offset, offset + 32);
        return new TreeClaimNote(value, bridgeId, defiInteractionNonce, fee, partialState, inputNullifier);
    }
    toBuffer() {
        return Buffer.concat([
            (0, _bigintBuffer.toBufferBE)(this.value, 32),
            this.bridgeId.toBuffer(),
            (0, _serialize.numToUInt32BE)(this.defiInteractionNonce),
            (0, _bigintBuffer.toBufferBE)(this.fee, 32),
            this.partialState,
            this.inputNullifier
        ]);
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    constructor(value, bridgeId, defiInteractionNonce, fee, partialState, inputNullifier){
        this.value = value, this.bridgeId = bridgeId, this.defiInteractionNonce = defiInteractionNonce, this.fee = fee, this.partialState = partialState, this.inputNullifier = inputNullifier;
    }
}
TreeClaimNote.EMPTY = new TreeClaimNote(BigInt(0), _bridgeId.BridgeId.ZERO, 0, BigInt(0), Buffer.alloc(32), Buffer.alloc(32)), TreeClaimNote.LENGTH = TreeClaimNote.EMPTY.toBuffer().length;
